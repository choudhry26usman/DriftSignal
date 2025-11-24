import { Client } from '@microsoft/microsoft-graph-client';

let connectionSettings: any;

async function getAccessToken() {
  if (connectionSettings && connectionSettings.settings && connectionSettings.settings.expires_at && new Date(connectionSettings.settings.expires_at).getTime() > Date.now()) {
    return connectionSettings.settings.access_token;
  }
  
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME
  const xReplitToken = process.env.REPL_IDENTITY 
    ? 'repl ' + process.env.REPL_IDENTITY 
    : process.env.WEB_REPL_RENEWAL 
    ? 'depl ' + process.env.WEB_REPL_RENEWAL 
    : null;

  if (!xReplitToken) {
    throw new Error('X_REPLIT_TOKEN not found for repl/depl');
  }

  try {
    const response = await fetch(
      'https://' + hostname + '/api/v2/connection?include_secrets=true&connector_names=outlook',
      {
        headers: {
          'Accept': 'application/json',
          'X_REPLIT_TOKEN': xReplitToken
        }
      }
    );
    
    const data = await response.json();
    connectionSettings = data.items?.[0];
    
    if (!connectionSettings) {
      throw new Error('Outlook connector not found - please add Outlook integration to this app');
    }
    
    if (!connectionSettings.settings) {
      throw new Error('Outlook connector found but not configured with settings');
    }
    
    const accessToken = connectionSettings.settings.access_token || connectionSettings.settings.oauth?.credentials?.access_token;
    
    if (!accessToken) {
      throw new Error('Outlook connected but access token not found');
    }
    
    return accessToken;
  } catch (error: any) {
    if (error.message.includes('Outlook')) {
      throw error;
    }
    throw new Error(`Failed to connect to Outlook: ${error.message}`);
  }
}

export async function getUncachableOutlookClient() {
  const accessToken = await getAccessToken();

  return Client.initWithMiddleware({
    authProvider: {
      getAccessToken: async () => accessToken
    }
  });
}
