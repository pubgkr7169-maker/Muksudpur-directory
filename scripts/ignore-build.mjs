// Only data writes carry this marker; API reads GitHub directly at runtime.
process.exit((process.env.VERCEL_GIT_COMMIT_MESSAGE||'').includes('[skip vercel]')?0:1);
