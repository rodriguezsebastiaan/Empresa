function readBooleanEnv(value: string | undefined) {
  return ['1', 'true', 'yes', 'on'].includes(value?.trim().toLowerCase() ?? '')
}

function normalizePem(value: string) {
  return value.replace(/\\n/g, '\n').trim()
}

export function isMysqlSslEnabled() {
  return readBooleanEnv(process.env.MYSQL_SSL_ENABLED)
}

export function buildMysqlPoolConfig(connectionString: string) {
  const url = new URL(connectionString)
  const sslEnabled = isMysqlSslEnabled()
  const sslCa = process.env.MYSQL_SSL_CA?.trim()
  const configuredHostname = process.env.MYSQL_HOSTNAME?.trim()
  const host = sslEnabled && configuredHostname ? configuredHostname : url.hostname

  if (sslEnabled && !sslCa) {
    throw new Error('MYSQL_SSL_CA_REQUIRED')
  }

  return {
    host,
    port: Number(url.port || 3306),
    user: decodeURIComponent(url.username),
    password: decodeURIComponent(url.password),
    database: url.pathname.replace(/^\//, ''),
    connectTimeout: 10000,
    allowPublicKeyRetrieval: true,
    ssl: sslEnabled
      ? {
          ca: normalizePem(sslCa ?? ''),
          rejectUnauthorized: true,
        }
      : undefined,
  }
}

export function getMysqlConnectionSummary(connectionString: string) {
  const url = new URL(connectionString)
  const sslEnabled = isMysqlSslEnabled()
  const configuredHostname = process.env.MYSQL_HOSTNAME?.trim()

  return {
    host: sslEnabled && configuredHostname ? configuredHostname : url.hostname,
    originalHost: url.hostname,
    port: Number(url.port || 3306),
    database: url.pathname.replace(/^\//, ''),
    user: decodeURIComponent(url.username),
    sslEnabled,
    sslCaConfigured: Boolean(process.env.MYSQL_SSL_CA?.trim()),
    hostnameOverrideConfigured: Boolean(configuredHostname),
  }
}
