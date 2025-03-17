## clerk用户数据示例

```json
{
  "id": "user_2uR5DXHOY8LV3NxeUWMwIx192Cj",
  "object": "user",
  "username": "qianmengqwq",
  "first_name": "sayoriqwq",
  "last_name": null,
  "image_url": "https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvb2F1dGhfZ2l0aHViL2ltZ18ydVI1RFRhNEdRN2FOdWpvV1owdkQ4WmZ2cnoifQ",
  "has_image": true,
  "primary_email_address_id": "idn_2uR5D0GIz6dSs7RBa9nTSTJZtpx",
  "primary_phone_number_id": null,
  "primary_web3_wallet_id": null,
  "password_enabled": false,
  "two_factor_enabled": false,
  "totp_enabled": false,
  "backup_code_enabled": false,
  "email_addresses": [
    {
      "id": "idn_2uR5D0GIz6dSs7RBa9nTSTJZtpx",
      "object": "email_address",
      "email_address": "2531600563@qq.com",
      "reserved": false,
      "verification": {
        "status": "verified",
        "strategy": "from_oauth_github",
        "attempts": null,
        "expire_at": null
      },
      "linked_to": [
        {
          "type": "oauth_github",
          "id": "idn_2uR5D3yBVij8eYnUCyP1n0aHq5w"
        }
      ],
      "matches_sso_connection": false,
      "created_at": 1742198422493,
      "updated_at": 1742198426433
    }
  ],
  "phone_numbers": [],
  "web3_wallets": [],
  "passkeys": [],
  "external_accounts": [
    {
      "object": "external_account",
      "id": "eac_2uR5D1oo6nvTAJMHgsE2flXqA12",
      "provider": "oauth_github",
      "identification_id": "idn_2uR5D3yBVij8eYnUCyP1n0aHq5w",
      "provider_user_id": "96559440",
      "approved_scopes": "read:user user:email",
      "email_address": "2531600563@qq.com",
      "first_name": "sayoriqwq",
      "last_name": "",
      "avatar_url": "https://avatars.githubusercontent.com/u/96559440?v=4",
      "image_url": "https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2F2YXRhcnMuZ2l0aHVidXNlcmNvbnRlbnQuY29tL3UvOTY1NTk0NDA/dj00IiwicyI6InRWV0l4UnB2M3ZQeTBpN2ZEQXE4b2ZXeitYTXlnaFcxS2pzK1R2SmxGVU0ifQ",
      "username": "qianmengqwq",
      "public_metadata": {},
      "label": null,
      "created_at": 1742198422486,
      "updated_at": 1742198422486,
      "verification": {
        "status": "verified",
        "strategy": "oauth_github",
        "attempts": null,
        "expire_at": 1742199017943
      }
    }
  ],
  "saml_accounts": [],
  "enterprise_accounts": [],
  "public_metadata": {},
  "private_metadata": {},
  "unsafe_metadata": {},
  "external_id": null,
  "last_sign_in_at": 1742198426421,
  "banned": false,
  "locked": false,
  "lockout_expires_in_seconds": null,
  "verification_attempts_remaining": 100,
  "created_at": 1742198426417,
  "updated_at": 1742198426451,
  "delete_self_enabled": true,
  "create_organization_enabled": true,
  "last_active_at": 1742198426417,
  "mfa_enabled_at": null,
  "mfa_disabled_at": null,
  "legal_accepted_at": null,
  "profile_image_url": "https://images.clerk.dev/oauth_github/img_2uR5DTa4GQ7aNujoWZ0vD8Zfvrz"
}
```
