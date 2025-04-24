#!/bin/bash

folders=(
    "packages/cli"
    "packages/openapi"
    "packages/module-utils"
    "packages/module-user"
    "packages/module-upload"
    "packages/module-installer"
    "packages/module-message"
    "packages/module-notification"
    "packages/module-project"
    "packages/module-web3"
    "packages/module-asset"
    "packages/module-currency"
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
    "packages/plugin-otp"
    "packages/plugin-email-sender"
    "packages/plugin-email-auth"
    "packages/plugin-web3-auth"
    "packages/plugin-payment"
    "packages/plugin-payment-web3"
    "packages/plugin-project-notification"
    "packages/plugin-firebase"
    "packages/plugin-firebase-auth"
    "packages/plugin-asset-web3"
    "packages/plugin-asset-category"
    "packages/plugin-user-info"
    "packages/plugin-web3-airdrop"
    "packages/plugin-store-record"
    "packages/plugin-casino-game"
    "packages/plugin-telegram-bot"
)

# Lặp qua từng thư mục
for dir in "${folders[@]}"; do
    if [ -d "$dir" ]; then
        echo "📂 Processing folder: $dir"
        cd "$dir"
        npx standard-version --release-as 3.3.0
        git push --follow-tags origin main && npm publish
        cd - > /dev/null
    else
        echo "⚠️ Folder not found: $dir"
    fi
done

echo "✅ Done!"
