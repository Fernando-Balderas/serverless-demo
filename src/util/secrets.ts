export const API_URL = process.env.REACT_APP_API_URL || ''

export const cognito = {
  region: process.env.REACT_APP_AWS_REGION || '',
  userPoolId: process.env.REACT_APP_AWS_USER_POOL_ID || '',
  userPoolWebClientId: process.env.REACT_APP_AWS_USER_POOL_CLIENT_ID || '',
}
