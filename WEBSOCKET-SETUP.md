# WebSocket Setup Guide for AlertaUTEC

This guide explains how to configure and use WebSocket for real-time notifications in the AlertaUTEC application.

## Overview

The application supports **two modes** for notifications:
1. **WebSocket (Real-time)** - Instant notifications via WebSocket connection
2. **Polling (Fallback)** - Checks for updates every 15 seconds

The system automatically falls back to polling if WebSocket connection fails.

## WebSocket Configuration

### 1. Environment Variables

The WebSocket URL is configured in two places:

**`.env` (Production)**
```env
NEXT_PUBLIC_API_URL=https://mzq13io4vk.execute-api.us-east-1.amazonaws.com/dev
NEXT_PUBLIC_WS_URL=wss://25vce58gt2.execute-api.us-east-1.amazonaws.com/dev
```

**`.env.local` (Local Development - Override)**
```env
# Comment this line to enable WebSocket
# NEXT_PUBLIC_WS_URL=wss://25vce58gt2.execute-api.us-east-1.amazonaws.com/dev
```

### 2. Get Your WebSocket URL

Your WebSocket API Gateway URL is:
```
wss://25vce58gt2.execute-api.us-east-1.amazonaws.com/dev
```

To verify it's correct:
1. Go to AWS Console → API Gateway
2. Find your WebSocket API (should have stage "dev")
3. Copy the WebSocket URL from the stages section

### 3. Enable WebSocket

To enable WebSocket notifications:

1. **Uncomment the line in `.env.local`:**
   ```env
   NEXT_PUBLIC_WS_URL=wss://25vce58gt2.execute-api.us-east-1.amazonaws.com/dev
   ```

2. **Restart your Next.js development server:**
   ```bash
   npm run dev
   ```

3. **Check browser console for connection status:**
   - ✅ Success: "WebSocket connected successfully"
   - ❌ Error: "WebSocket error, falling back to polling"

## How It Works

### WebSocket Client (`lib/websocket.ts`)

The `IncidentWebSocket` class handles:
- **Connection management** with automatic reconnection (up to 5 attempts)
- **Authentication** via query parameters (`userId` and `token`)
- **Ping/pong** to keep connection alive (every 4 minutes)
- **Message routing** for different notification types

### Notification Types

The system handles three types of notifications:

1. **`incident_status_changed`** - When incident status changes
   ```json
   {
     "type": "incident_status_changed",
     "incidentId": "abc123",
     "newStatus": "en_atención",
     "data": { ... }
   }
   ```

2. **`comment_added`** - When a comment is added
   ```json
   {
     "type": "comment_added",
     "incidentId": "abc123",
     "comment": "We're working on it",
     "data": { ... }
   }
   ```

3. **`department_assigned`** - When incident is assigned to department
   ```json
   {
     "type": "department_assigned",
     "incidentId": "abc123",
     "department": "Mantenimiento",
     "data": { ... }
   }
   ```

### Notification Center (`components/notifications/notification-center.tsx`)

The notification center:
- Tries WebSocket first if `NEXT_PUBLIC_WS_URL` is set
- Falls back to polling if WebSocket fails
- Displays toast notifications (pop-ups in bottom-right corner)
- Maintains notification history
- Plays sound on new notifications

### Toast Notifications (`components/ui/toast.tsx`)

Toast notifications:
- Auto-dismiss after 5 seconds
- Color-coded by type (success=green, error=red, warning=yellow, info=blue)
- Slide-in animation from right
- Can be manually closed

## Backend Requirements

For WebSocket to work, your AWS Lambda backend needs:

### Lambda Functions

1. **`connect`** - Handles new WebSocket connections
   - Should return `{ statusCode: 200 }`
   - Stores `connectionId` in DynamoDB with `userId`

2. **`disconnect`** - Handles disconnections
   - Removes `connectionId` from DynamoDB

3. **`default`** - Handles messages (ping/pong)
   - Responds to ping messages

4. **Notification Lambdas** - Send messages to clients
   - `notifyIncidentStatusChanged`
   - `notifyCommentAdded`
   - `notifyDepartmentAssigned`

### DynamoDB Table

Required table structure:
```
Table: websocket-connections
Primary Key: connectionId (String)
Attributes:
  - userId (String)
  - connectedAt (Number - timestamp)
```

### IAM Permissions

Lambda functions need permissions to:
- `dynamodb:PutItem` (connect)
- `dynamodb:DeleteItem` (disconnect)
- `dynamodb:Query` (find connections by userId)
- `execute-api:ManageConnections` (send messages to clients)

## Troubleshooting

### WebSocket Error 1006

If you see error code 1006 (abnormal closure):

1. **Check Lambda logs:**
   ```bash
   aws logs tail /aws/lambda/websocket-backend-dev-connect --follow
   ```

2. **Common causes:**
   - Lambda `connect` returning wrong format (must return `{ statusCode: 200 }`)
   - Missing IAM permissions for DynamoDB
   - CORS issues (WebSocket doesn't use CORS, but API Gateway routes might)
   - Lambda timeout (increase to 10 seconds)

3. **Test the connection Lambda:**
   ```bash
   # Use wscat to test WebSocket connection
   npm install -g wscat
   wscat -c "wss://25vce58gt2.execute-api.us-east-1.amazonaws.com/dev?userId=test&token=yourtoken"
   ```

### Fallback to Polling

If WebSocket permanently fails:
- The system automatically falls back to polling every 15 seconds
- You'll see: "Using polling for notifications (every 15s)" in console
- Polling works by calling `/student/incidents/mine` and comparing results

### No Notifications Appearing

1. **Check authentication:**
   - User must be logged in
   - Token must be stored in `localStorage.authToken`
   - User ID must be stored in `localStorage.user`

2. **Check backend:**
   - Backend must be calling notification Lambdas when status changes
   - Notification Lambdas must query DynamoDB for user's connectionId
   - Must send message via API Gateway Management API

3. **Check browser console:**
   - Look for WebSocket connection messages
   - Look for received messages
   - Check for errors

## Testing

### Test WebSocket Connection

1. Login to the application
2. Open browser DevTools → Console
3. Look for: "✅ WebSocket connected successfully"
4. Have another user (or admin) change your incident status
5. You should see:
   - Console: "📨 WebSocket message received"
   - Toast notification appears in bottom-right
   - Sound plays

### Test Polling Fallback

1. Comment out `NEXT_PUBLIC_WS_URL` in `.env.local`
2. Restart dev server
3. Login to application
4. Look for: "📊 Using polling for notifications (every 15s)"
5. Console should show API calls every 15 seconds

## Production Deployment

When deploying to production:

1. **Ensure `.env` has WebSocket URL:**
   ```env
   NEXT_PUBLIC_WS_URL=wss://your-production-ws-url.amazonaws.com/prod
   ```

2. **Don't commit `.env.local` (it's gitignored)**

3. **Set environment variable in hosting platform:**
   - Vercel: Project Settings → Environment Variables
   - Add: `NEXT_PUBLIC_WS_URL=wss://...`

4. **Backend must be deployed and working:**
   - All Lambda functions deployed
   - DynamoDB table created
   - IAM permissions configured
   - API Gateway deployed to production stage

## Files Overview

```
├── lib/
│   └── websocket.ts              # WebSocket client class
├── components/
│   ├── ui/
│   │   └── toast.tsx             # Toast notification components
│   └── notifications/
│       └── notification-center.tsx  # Main notification center
├── app/
│   └── globals.css               # Toast animations
├── .env                          # Production config (committed)
└── .env.local                    # Local override (gitignored)
```

## Support

If you continue to have WebSocket issues:

1. **Check CloudWatch Logs** for all Lambda functions
2. **Verify DynamoDB table** has correct structure
3. **Test with wscat** to isolate frontend vs backend issues
4. **Use polling mode** as a reliable fallback while debugging

The polling mode provides the same functionality, just with a 15-second delay instead of instant notifications.
