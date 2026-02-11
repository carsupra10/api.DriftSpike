import { firestore } from '../lib/connection-manager.js';
import { collection, getDocs, limit, query } from 'firebase/firestore';

let healthMetrics = {
  uptime: Date.now(),
  requests: 0,
  errors: 0,
  avgResponseTime: 0,
  lastCheck: Date.now()
};

export default async function handler(req, res) {
  const startTime = Date.now();
  healthMetrics.requests++;

  try {
    // Quick database health check
    const dbStart = Date.now();
    try {
      const usersRef = collection(firestore, 'users');
      const q = query(usersRef, limit(1));
      await getDocs(q);
      var dbError = null;
    } catch (err) {
      var dbError = err;
    }
    const dbTime = Date.now() - dbStart;

    const responseTime = Date.now() - startTime;
    healthMetrics.avgResponseTime = (healthMetrics.avgResponseTime + responseTime) / 2;
    healthMetrics.lastCheck = Date.now();

    const health = {
      status: dbError ? 'degraded' : 'healthy',
      timestamp: new Date().toISOString(),
      uptime: Date.now() - healthMetrics.uptime,
      database: {
        status: dbError ? 'error' : 'connected',
        responseTime: `${dbTime}ms`,
        error: dbError?.message
      },
      metrics: {
        totalRequests: healthMetrics.requests,
        totalErrors: healthMetrics.errors,
        avgResponseTime: `${Math.round(healthMetrics.avgResponseTime)}ms`,
        errorRate: `${((healthMetrics.errors / healthMetrics.requests) * 100).toFixed(2)}%`
      },
      performance: {
        responseTime: `${responseTime}ms`,
        memoryUsage: process.memoryUsage(),
        nodeVersion: process.version
      }
    };

    res.setHeader('Cache-Control', 'no-cache');
    return res.status(dbError ? 503 : 200).json(health);

  } catch (error) {
    healthMetrics.errors++;
    return res.status(503).json({
      status: 'unhealthy',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
}