#!/bin/bash

folders=(
    "packages/openapi"
    "packages/module-user"
    "packages/module-system"
    "packages/module-upload"
    "packages/module-installer"
    "packages/module-message"
    "packages/module-notification"
    "packages/module-project"
    "packages/module-web3"
    "packages/module-asset"
    "packages/module-currency"
    "packages/module-location"
    "packages/plugin-sequence"
    "packages/module-accounting"
    "packages/module-socket"
    "packages/module-game"
    "packages/module-referral"
    "packages/module-workflow"
    "packages/module-reward"
    "packages/module-wager"
    "packages/plugin-asset-template"
    "packages/module-order"
    "packages/module-skill"
    "packages/module-timesheet"
    "packages/module-organization"
    "packages/module-finance-contract"
    "packages/plugin-api-logger"
    "packages/plugin-api-rate-limiter"
    "packages/plugin-otp"
    "packages/plugin-email-sender"
    "packages/plugin-auth-email"
    "packages/plugin-auth-web3"
    "packages/plugin-auth-webauthn"
    "packages/plugin-auth-two-factor"
    "packages/plugin-identity-pin"
    "packages/plugin-identity-totp"
    "packages/plugin-auth-two-factor-totp"
    "packages/plugin-reauth-password"
    "packages/plugin-payment"
    "packages/plugin-payment-web3"
    "packages/plugin-project-notification"
    "packages/plugin-project-message"
    "packages/plugin-firebase"
    "packages/plugin-auth-firebase"
    "packages/plugin-asset-web3"
    "packages/plugin-asset-category"
    "packages/plugin-user-ban"
    "packages/plugin-user-info"
    "packages/plugin-web3-airdrop"
    "packages/plugin-store-record"
    "packages/plugin-casino-game"
    "packages/plugin-telegram-bot"
    "packages/plugin-message-report"
    "packages/plugin-message-reaction"
    "packages/plugin-message-pin"
    "packages/plugin-message-media"
    "packages/plugin-message-poll"
    "packages/plugin-message-notification"
    "packages/plugin-notification-in-app"
    "packages/plugin-notification-push"
    "packages/plugin-notification-push-web"
    "packages/plugin-location-countries"
    "packages/plugin-location-vietnam"
    "packages/plugin-location-address"
    "packages/plugin-news"
)

# Lặp qua từng thư mục
for dir in "${folders[@]}"; do
    if [ -d "$dir" ]; then
        echo "📂 Processing folder: $dir"
        cd "$dir"
        npx roxavn sync
        npx roxavn migration:up
        npm run build
        npx standard-version --release-as 3.6.0
        git push --follow-tags origin main && npm publish
        cd - > /dev/null
    else
        echo "⚠️ Folder not found: $dir"
    fi
done

echo "✅ Done!"
