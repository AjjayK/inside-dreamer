# Agent: Attain Analyst

**ID:** 44a0afe9-5fe1-484c-81b0-467ea382be53

## Description

# OVERVIEW

A personal finance agent that connects to banking and credit card accounts via Attain Finance, enriches transactions with receipt/shipping/merchant data, generates AI-powered financial insights, and surfaces actionable to-do items in a swipe-to-dismiss inbox.

# USER JOURNEY

## 1. Account Connection
New users see an onboarding screen and connect accounts via Attain Finance's Plaid integration (multi-institution support).

## 2. Automatic Enrichment
On account connection, batch enrichment begins automatically:
- Queries unenriched transactions, processes in batches (10 -> 20 -> 50 per batch)
- Each batch runs as a Sidekick Task that searches Gmail for receipts, extracts shipping info, and generates AI insights
- Hourly cron continues enriching remaining transactions
- On-demand single-transaction enrichment available

## 3. Financial Insights
After enrichment, AI-generated insights surface in the inbox:
- Subscription overlap/deal detection
- Credit utilization warnings
- Spending pattern observations
- Saving opportunities
- Monthly regeneration via cron

## 4. Financial Inbox (To-Do List)
The inbox is a financial to-do list (not a chat interface). Items include:
- Welcome/onboarding messages
- Transaction review setup (configurable: all, low_confidence, or none)
- Transaction category reviews
- Large transaction alerts
- Subscription/bill reminders
- AI-generated financial insights
- Shipment status updates

**Mobile UX**: Tinder-style swipe cards (right = done, left = snooze). Desktop shows a list with action buttons.

## 5. Ongoing Engagement
- Hourly enrichment drip for new transactions
- Every-4-hours shipping status monitoring
- Monthly spending review posted as agent bulletin
- Monthly insight regeneration with deduplication

# FOLDER STRUCTURE

```
src/
├── App.tsx                        # Entry point -> WidgetView or AppView
├── server.ts                      # ~627 lines, thin wiring to services
├── schema.ts                      # Drizzle ORM schema
├── lib/
│   └── dayjs.ts                   # Configured dayjs with timezone plugins
├── data/
│   └── merchant-return-policies.ts # Seed data for return policies
├── prompts/
│   ├── index.ts                   # Template registry
│   ├── analyze-conversation.handlebars
│   ├── build-financial-context.handlebars
│   ├── enrich-transactions-task.handlebars
│   ├── immediate-financial-insights.handlebars
│   ├── recategorize-enriched.handlebars
│   ├── transaction-finance-analysis.handlebars
│   ├── update-watching-transactions.handlebars
│   └── partials/
│       └── categories.handlebars
├── services/
│   ├── index.ts                   # Re-exports all services
│   ├── types.ts                   # Shared TypeScript types
│   ├── accounts.ts                # Account connection, status, disconnect
│   ├── spending.ts                # Spending calculations, category breakdowns
│   ├── transactions.ts            # Transaction queries, filtering, category updates
│   ├── recurring.ts               # Recurring transaction detection
│   ├── insights.ts                # Financial insights generation + monthly regeneration
│   ├── inbox.ts                   # Inbox to-do CRUD, snooze
│   ├── goals.ts                   # Gamification/goal progress
│   ├── seed.ts                    # Merchant return policies + onboarding seeds
│   ├── conversation.ts            # Conversation analysis
│   ├── demoData.ts                # Demo/fallback data
│   └── enrichment/                # 10-file subdirectory
│       ├── index.ts               # Re-exports + flow diagram
│       ├── constants.ts           # Batch sizes, thresholds
│       ├── schemas.ts             # TypeBox callback schemas
│       ├── helpers.ts             # Shared utilities
│       ├── queries.ts             # Read-only enrichment operations
│       ├── batch.ts               # Batch enrichment (initial + background)
│       ├── single.ts              # Single transaction enrichment
│       ├── post-analysis.ts       # Financial context + recategorization
│       ├── recovery.ts            # Stale job detection/recovery
│       └── shipping.ts            # Shipping status monitoring
└── components/
    ├── views/
    │   ├── AppView.tsx            # Main app container, tab routing, card rendering
    │   ├── HomeView.tsx           # Dashboard home tab
    │   ├── InboxView.tsx          # Inbox tab (list + swipe modes)
    │   ├── TransactionsView.tsx   # Transactions tab wrapper
    │   ├── OnboardingView.tsx     # First-time user onboarding
    │   ├── WidgetView.tsx         # ~300x300 widget for home screen
    │   ├── tabConfig.ts           # Unified tab definitions (desktop/mobile)
    │   ├── homeCards.ts           # Home card registry (desktop/mobile)
    │   └── transactions/
    │       ├── TransactionFiltersBar.tsx
    │       ├── TransactionTable.tsx
    │       ├── TransactionMobileList.tsx
    │       └── useTransactionFilters.ts
    ├── cards/
    │   ├── AccountsPanel.tsx
    │   ├── AddVisualizationCard.tsx
    │   ├── BudgetCard.tsx
    │   ├── ConnectedAccountsTable.tsx
    │   ├── ConnectMoreAccounts.tsx
    │   ├── EnrichmentProgress.tsx
    │   ├── EnrichmentStatusCard.tsx
    │   ├── InitialEnrichmentProgress.tsx
    │   ├── InsightsProgress.tsx
    │   ├── MonthCard.tsx
    │   ├── NetWorthCard.tsx
    │   ├── RecurringCalendarCard.tsx
    │   └── TransactionEnrichmentPanel.tsx
    ├── charts/
    │   ├── CategoryBreakdownChart.tsx
    │   └── MonthComparison.tsx
    ├── inbox/
    │   ├── index.ts
    │   ├── types.ts               # InboxItemType, FinancialTodoItem, etc.
    │   ├── utils.ts
    │   ├── FinancialTodoItem.tsx   # Individual to-do item row
    │   ├── FinancialTodoList.tsx   # To-do list container
    │   ├── CategorySelectorModal.tsx
    │   ├── InboxEnrichmentProgress.tsx
    │   ├── InboxItemActions.tsx
    │   ├── InboxItemDetails.tsx    # Detail view router
    │   ├── TransactionRow.tsx
    │   ├── details/               # Detail content by item type
    │   │   ├── sharedTypes.ts
    │   │   ├── FeatureCard.tsx
    │   │   ├── WelcomeDetailContent.tsx
    │   │   ├── TransactionReviewSetupContent.tsx
    │   │   ├── TransactionReviewDetailContent.tsx
    │   │   ├── InsightDetailContent.tsx
    │   │   └── RegularItemDetailContent.tsx
    │   └── swipe/
    │       ├── index.ts
    │       ├── swipeConstants.ts
    │       ├── SwipeCardStack.tsx
    │       ├── SwipeCard.tsx
    │       ├── SwipeIndicators.tsx
    │       ├── SwipeEmptyState.tsx
    │       └── SwipeTutorialOverlay.tsx
    ├── onboarding/
    │   ├── ConnectPanel.tsx
    │   ├── DesktopPreviewStep.tsx
    │   └── PreviewCard.tsx
    └── shared/
        ├── AccentIcon.tsx         # Reusable icon-in-circle component
        ├── AttainLogo.tsx
        ├── CategoryPicker.tsx
        ├── constants.ts           # Brand colors, font family
        ├── GoalProgressBar.tsx
        ├── LoadingIcon.tsx
        ├── PrivacyModeContext.tsx
        ├── SettingsModal.tsx
        ├── utils.ts
        └── hooks/
            ├── useInboxMutations.ts
            └── usePlaidLink.ts
```

# DATABASE SCHEMA

| Table | Purpose |
|-------|---------|
| `userSettings` | Key-value store for preferences (privacyMode, appPrivacyMode, transactionReviewMode) |
| `userGoals` | Gamification progress tracking (categorize_5 goal) |
| `monthlyReviews` | Tracks which months have had spending reviews |
| `merchantReturnPolicies` | Seeded merchant return policy data (days, URL, notes) |
| `transactionEnrichments` | Per-transaction enrichment: receipts, shipping, return policy, AI insights, finance insights, merchant info |
| `enrichmentJobs` | Batch job tracking with staleness detection |
| `inboxItems` | Financial to-do items with type, status, snooze, metadata |

# SERVER FUNCTIONS

## Settings
- `getUserSettings` - Privacy mode, review mode preferences
- `setPrivacyMode` / `setAppPrivacyMode` - Toggle privacy for widget/app

## Transactions
- `getAllTransactions` - Filtered/paginated transaction list
- `getRecentTransactions` - Most recent N transactions
- `setTransactionCategory` - Update category via Attain Finance API
- `setTransactionReviewMode` - Configure review mode (all/low_confidence/none)
- `getActiveShipments` - Transactions with active shipments for widget

## Accounts
- `getAccountStatus` - Connected account check (exported)
- `getConnectedAccounts` - Account list with balances
- `initiateAccountConnection` - Start Plaid connection
- `disconnectAccount` - Remove an account

## Spending & Budgets
- `getSpendingData` - Monthly totals, categories, comparisons (exported)
- `getBudgets` - Budget list with spending progress (exported)
- `getRecurringTransactions` - Subscriptions and income streams (exported)

## Goals
- `getGoalProgress` - Current gamification progress

## Enrichment
- `checkAndStartInitialEnrichment` - Auto-start on page load
- `getInitialEnrichmentStatus` - Progress bar polling
- `getEnrichmentStats` - Overall enrichment statistics
- `startManualEnrichment` - Manual trigger for all unenriched
- `enrichSingleTransaction` - On-demand single enrichment
- `getTransactionEnrichmentData` - Enrichment data for a transaction
- `resetEnrichmentData` - Clear and optionally restart (testing)
- `restartStaleJob` - Recover stuck enrichment jobs
- `handleBatchEnrichmentResults` - Batch callback (exported)
- `handleSingleEnrichmentResult` - Single callback (exported)
- `handleFinancialContextAnalysis` - Post-analysis callback (exported)
- `handleRecategorizationResults` - Recategorization callback (exported)
- `handleTransactionFinanceAnalysis` - Finance analysis callback (exported)
- `updateEnrichmentProgress` - Progress update callback (exported)
- `handleWatchingTransactionsUpdate` - Shipping update callback (exported)

## Inbox
- `getFinancialTodos` - Pending to-do items (filters snoozed)
- `updateTodoStatus` - Mark completed/dismissed/saved
- `snoozeInboxItem` - Snooze for N hours

## Insights
- `startImmediateFinancialInsights` - Trigger insight generation
- `handleImmediateFinancialInsights` - Insight callback (exported)
- `getImmediateInsightsStatus` - Check insight generation status
- `resetInsightsStatus` - Allow re-running insights
- `regenerateInsights` - Generate new insights avoiding duplicates

## Sidekick
- `talkWithSidekick` - Generic Sidekick conversation

## Background Functions (Cron Triggers)
- `main` - Monthly spending review (1st of month, 9 AM)
- `backgroundEnrichmentDrip` - Hourly enrichment of new transactions
- `updateWatchingTransactions` - Every 4 hours, shipping status checks
- `monthlyInsightRegeneration` - Monthly insight refresh (15th of month)

# DESIGN

## Brand Colors (shared/constants.ts)
- `ACCENT_GREEN`: #10a37f (positive values, success)
- `ACCENT_GREEN_DARK`: #0d8a6a (hover/emphasis)
- `ACCENT_RED`: #f87171 (expenses, negative)
- `ACCENT_RED_LIGHT`: #fee2e2 (subtle backgrounds)
- `ACCENT_INSIGHTS`: #F59E0B (insight-related UI)
- Font: Avenir Next with system fallbacks

## Tabs (tabConfig.ts)
| Tab | Desktop | Mobile |
|-----|---------|--------|
| Home | Yes | Yes |
| Inbox | Yes | Yes |
| Accounts | No | Yes |
| Transactions | Yes | Yes |

## Home Cards (homeCards.ts)
Rendered in order, filtered by breakpoint:
1. Connect More Accounts (desktop only)
2. Initial Enrichment Progress
3. Insights Progress
4. Spending Overview
5. Recurring Calendar
6. Add Visualization (desktop only)

NetWorthCard and BudgetCard are disabled (commented out in registry).

## Mobile Swipe Experience
Tinder-style card interface for inbox items using Framer Motion. Local queue pattern prevents React Query re-renders from breaking animations. Physics: 120px swipe threshold, 800px/s velocity, 15deg max rotation.

## Widget (~300x300)
Compact spending summary with current month total, trend, mini chart, and active shipments.

# EXTENDING THIS AGENT

## Adding a New Home Card
1. Add entry to `HOME_CARDS` in `src/components/views/homeCards.ts`
2. Add render case in `AppView.tsx`'s `renderHomeCard` switch

## Adding a New Tab
1. Add entry to `TABS` in `src/components/views/tabConfig.ts`
2. Add render case in `AppView.tsx`

## Adding a New Inbox Item Type
1. Add type to `InboxItemType` union in `src/components/inbox/types.ts`
2. Add detail content component in `src/components/inbox/details/`
3. Add case to `InboxItemDetails.tsx`
4. Create the item in the appropriate service

## Adding a New Background Job
1. Create `backgroundFunction` in `server.ts` with `exported: true`
2. Add cron trigger to `agent.yaml`
3. Implement logic in the appropriate service file

## Adding a New Prompt Template
1. Create `.handlebars` file in `src/prompts/`
2. Register in `src/prompts/index.ts`
3. Use compiled template with `sdk.callLLM` or Sidekick Tasks


## Server Functions (54)

### analyzeEnrichedTransactions

**Description:** Runs AI analysis on enriched but unanalyzed transactions

**Input Schema:**

```json
{
  "type": "object",
  "properties": {}
}
```

### backgroundEnrichmentDrip

**Description:** Hourly background job to enrich unenriched transactions

**Input Schema:**

```json
{
  "type": "object",
  "properties": {}
}
```

### checkAndStartInitialEnrichment

**Description:** Checks if initial enrichment is needed and starts it automatically

**Input Schema:**

```json
{
  "type": "object",
  "properties": {}
}
```

### devGetStatus

**Description:** [DEV] Gets current devtools status flags and record counts

**Input Schema:**

```json
{
  "type": "object",
  "properties": {}
}
```

### devResetAll

**Description:** [DEV] Resets all user state (enrichments, inbox, goals, settings) for testing

**Input Schema:**

```json
{
  "type": "object",
  "properties": {}
}
```

### devSetSimulateNoAccounts

**Description:** [DEV] Toggles the 'no accounts' simulation flag

**Input Schema:**

```json
{
  "type": "object",
  "required": [
    "enabled"
  ],
  "properties": {
    "enabled": {
      "type": "boolean",
      "description": "Whether to simulate having no accounts"
    }
  }
}
```

### devSimulateConnect

**Description:** [DEV] Simulates connecting an account by removing the simulation flag

**Input Schema:**

```json
{
  "type": "object",
  "properties": {}
}
```

### disconnectAccount

**Description:** Disconnects a financial account and removes all associated data

**Input Schema:**

```json
{
  "type": "object",
  "required": [
    "itemId"
  ],
  "properties": {
    "itemId": {
      "type": "string",
      "description": "The item ID of the account to disconnect"
    }
  }
}
```

### enrichSingleTransaction

**Description:** Enriches a single transaction on-demand

**Input Schema:**

```json
{
  "type": "object",
  "required": [
    "transactionId"
  ],
  "properties": {
    "transactionId": {
      "type": "string",
      "description": "The transaction ID to enrich"
    }
  }
}
```

### getAccountStatus

**Description:** Gets the status of connected financial accounts

**Input Schema:**

```json
{
  "type": "object",
  "properties": {
    "forceRefresh": {
      "type": "boolean",
      "description": "Skip cache and fetch fresh data"
    }
  }
}
```

### getActiveShipments

**Description:** Gets transactions with active shipments for widget display

**Input Schema:**

```json
{
  "type": "object",
  "properties": {
    "limit": {
      "type": "number",
      "default": 3,
      "description": "Maximum number of shipments to return"
    }
  }
}
```

### getAgentActivity

**Description:** Gets recent agent activity log entries

**Input Schema:**

```json
{
  "type": "object",
  "properties": {
    "limit": {
      "type": "number",
      "description": "Max items to return (default 20)"
    }
  }
}
```

### getAllTransactions

**Description:** Gets all transactions with optional filters for date range, category, account, and budget

**Input Schema:**

```json
{
  "type": "object",
  "properties": {
    "endDate": {
      "type": "string",
      "description": "End date filter (YYYY-MM-DD)"
    },
    "budgetId": {
      "type": "string",
      "description": "Filter by budget ID"
    },
    "category": {
      "type": "string",
      "description": "Filter by category"
    },
    "startDate": {
      "type": "string",
      "description": "Start date filter (YYYY-MM-DD)"
    },
    "accountName": {
      "type": "string",
      "description": "Filter by account name"
    },
    "searchQuery": {
      "type": "string",
      "description": "Search in transaction descriptions"
    }
  }
}
```

### getBudgets

**Description:** Gets all budgets with their spending progress

**Input Schema:**

```json
{
  "type": "object",
  "properties": {}
}
```

### getCoachAgentStatus

**Description:** Gets the Attain Coach agent status via cross-agent call

**Input Schema:**

```json
{
  "type": "object",
  "properties": {
    "forceRefresh": {
      "type": "boolean",
      "description": "Skip cache and fetch fresh data"
    }
  }
}
```

### getConnectedAccounts

**Description:** Gets the list of connected financial accounts with their balances

**Input Schema:**

```json
{
  "type": "object",
  "properties": {
    "forceRefresh": {
      "type": "boolean",
      "description": "Skip cache and fetch fresh data"
    }
  }
}
```

### getDebtAndInvestments

**Description:** Investment portfolio total and holding count, plus total debt and liability count.

**Input Schema:**

```json
{
  "type": "object",
  "properties": {}
}
```

### getEnrichmentStats

**Description:** Gets enrichment statistics: total transactions, enriched count, job status

**Input Schema:**

```json
{
  "type": "object",
  "properties": {}
}
```

### getEnrichmentValueSummary

**Description:** Gets aggregated enrichment value summary for the Agents tab visualization

**Input Schema:**

```json
{
  "type": "object",
  "properties": {}
}
```

### getFinancialOverview

**Description:** Core financial snapshot: net worth, total assets/liabilities, connected accounts with balances, and cash flow for last month and current month.

**Input Schema:**

```json
{
  "type": "object",
  "properties": {}
}
```

### getGoalProgress

**Description:** Gets the current user goal progress based on manually categorized transactions

**Input Schema:**

```json
{
  "type": "object",
  "properties": {}
}
```

### getImmediateInsightsStatus

**Description:** Gets the current status of immediate financial insights analysis

**Input Schema:**

```json
{
  "type": "object",
  "properties": {}
}
```

### getInitialEnrichmentStatus

**Description:** Gets the status of the initial enrichment job for progress bar

**Input Schema:**

```json
{
  "type": "object",
  "properties": {}
}
```

### getNetWorthChange

**Description:** Gets net worth with D/W/M percentage changes from financial summary snapshots and per-account balance history

**Input Schema:**

```json
{
  "type": "object",
  "properties": {}
}
```

### getRecentActivity

**Description:** Recent transactions (default 15). Returns date, description, amount, and category for each.

**Input Schema:**

```json
{
  "type": "object",
  "properties": {
    "limit": {
      "type": "number",
      "description": "Max transactions to return (default 15)"
    }
  }
}
```

### getRecentTransactions

**Description:** Gets the most recent transactions sorted by date

**Input Schema:**

```json
{
  "type": "object",
  "properties": {
    "limit": {
      "type": "number",
      "description": "Number of transactions to return (default 5)"
    }
  }
}
```

### getRecurringStreams

**Description:** Active recurring income and expense streams (subscriptions, paychecks, bills) with estimated monthly totals.

**Input Schema:**

```json
{
  "type": "object",
  "properties": {}
}
```

### getRecurringTransactions

**Description:** Gets recurring transactions including subscriptions and income streams

**Input Schema:**

```json
{
  "type": "object",
  "properties": {
    "forceRefresh": {
      "type": "boolean",
      "description": "Skip cache and fetch fresh data"
    }
  }
}
```

### getShippingAgentSummary

**Description:** Gets shipping agent summary for the Agents tab visualization

**Input Schema:**

```json
{
  "type": "object",
  "properties": {}
}
```

### getSpendingData

**Description:** Gets spending data including monthly totals, category breakdown, recurring expenses, and recent transactions

**Input Schema:**

```json
{
  "type": "object",
  "properties": {
    "monthOffset": {
      "type": "number",
      "description": "Number of months to go back from current month (0 = current, 1 = last month, etc.)"
    },
    "forceRefresh": {
      "type": "boolean",
      "description": "Skip cache and fetch fresh data"
    }
  }
}
```

### getSpendingSummary

**Description:** Full spending summary: combines financial overview, recurring streams, recent activity, and debt/investments into one response with a formatted markdown string. Use the individual functions above if you only need a subset.

**Input Schema:**

```json
{
  "type": "object",
  "properties": {}
}
```

### getTransactionEnrichmentData

**Description:** Gets enrichment data for a specific transaction

**Input Schema:**

```json
{
  "type": "object",
  "required": [
    "transactionId"
  ],
  "properties": {
    "transactionId": {
      "type": "string",
      "description": "The transaction ID"
    }
  }
}
```

### getUserSettings

**Description:** Gets user settings including privacy mode and transaction review mode

**Input Schema:**

```json
{
  "type": "object",
  "properties": {}
}
```

### handleBatchEnrichmentResults

**Description:** Receives batch enrichment results and starts next batch if needed

**Input Schema:**

```json
{
  "type": "object",
  "required": [
    "jobId",
    "results"
  ],
  "properties": {
    "jobId": {
      "type": "number",
      "description": "The enrichment job ID"
    },
    "results": {
      "type": "array",
      "items": {
        "type": "object",
        "required": [
          "transactionId",
          "success"
        ],
        "properties": {
          "error": {
            "type": "string"
          },
          "receipt": {
            "type": "object",
            "required": [
              "merchantName",
              "receiptDate",
              "items"
            ],
            "properties": {
              "items": {
                "type": "array",
                "items": {
                  "type": "object",
                  "required": [
                    "item",
                    "quantity",
                    "price"
                  ],
                  "properties": {
                    "item": {
                      "type": "string"
                    },
                    "price": {
                      "type": "number"
                    },
                    "imageUrl": {
                      "type": "string"
                    },
                    "quantity": {
                      "type": "number"
                    }
                  }
                }
              },
              "receiptDate": {
                "type": "string"
              },
              "merchantName": {
                "type": "string"
              }
            }
          },
          "success": {
            "type": "boolean"
          },
          "merchant": {
            "type": "object",
            "required": [
              "displayName"
            ],
            "properties": {
              "logoUrl": {
                "type": "string"
              },
              "website": {
                "type": "string"
              },
              "displayName": {
                "type": "string"
              }
            }
          },
          "shipment": {
            "type": "object",
            "required": [
              "carrier",
              "trackingNumber",
              "status"
            ],
            "properties": {
              "status": {
                "type": "string"
              },
              "carrier": {
                "type": "string"
              },
              "lastUpdate": {
                "type": "string"
              },
              "productName": {
                "type": "string"
              },
              "trackingNumber": {
                "type": "string"
              },
              "estimatedDelivery": {
                "type": "string"
              }
            }
          },
          "aiInsights": {
            "type": "object",
            "required": [
              "summary"
            ],
            "properties": {
              "summary": {
                "type": "string"
              },
              "merchantType": {
                "type": "string"
              },
              "contextUpdate": {
                "type": "string"
              },
              "categoryReason": {
                "type": "string"
              },
              "categoryCorrect": {
                "type": "boolean"
              },
              "financeInsights": {
                "type": "array",
                "items": {
                  "type": "object",
                  "required": [
                    "type",
                    "insight"
                  ],
                  "properties": {
                    "type": {
                      "type": "string"
                    },
                    "insight": {
                      "type": "string"
                    },
                    "actionable": {
                      "type": "boolean"
                    }
                  }
                }
              },
              "recurringPattern": {
                "type": "string"
              },
              "suggestedCategory": {
                "type": "string"
              },
              "categoryConfidence": {
                "type": "number"
              }
            }
          },
          "transactionId": {
            "type": "string"
          }
        }
      }
    },
    "batchNumber": {
      "type": "number",
      "description": "The batch number (1-indexed)"
    }
  }
}
```

### handleImmediateFinancialInsights

**Description:** Receives immediate financial insights results and creates inbox items

**Input Schema:**

```json
{
  "type": "object",
  "required": [
    "insights",
    "summary"
  ],
  "properties": {
    "summary": {
      "type": "string"
    },
    "insights": {
      "type": "array",
      "items": {
        "type": "object",
        "required": [
          "type",
          "category",
          "priority",
          "title",
          "subtitle"
        ],
        "properties": {
          "type": {
            "type": "string"
          },
          "title": {
            "type": "string"
          },
          "category": {
            "type": "string"
          },
          "metadata": {
            "type": "object",
            "properties": {
              "source": {
                "type": "string"
              },
              "details": {
                "type": "string"
              },
              "creditCardBalance": {
                "type": "number"
              },
              "creditUtilization": {
                "type": "number"
              },
              "relatedSubscriptions": {
                "type": "array",
                "items": {
                  "type": "string"
                }
              }
            }
          },
          "priority": {
            "type": "string"
          },
          "subtitle": {
            "type": "string"
          },
          "actionItems": {
            "type": "array",
            "items": {
              "type": "string"
            }
          },
          "potentialSavings": {
            "type": "number"
          }
        }
      }
    }
  }
}
```

### handleSingleEnrichmentResult

**Description:** Receives single transaction enrichment result from Sidekick Task

**Input Schema:**

```json
{
  "type": "object",
  "required": [
    "transactionId",
    "success"
  ],
  "properties": {
    "error": {
      "type": "string"
    },
    "receipt": {
      "type": "object",
      "required": [
        "merchantName",
        "receiptDate",
        "items"
      ],
      "properties": {
        "items": {
          "type": "array",
          "items": {
            "type": "object",
            "required": [
              "item",
              "quantity",
              "price"
            ],
            "properties": {
              "item": {
                "type": "string"
              },
              "price": {
                "type": "number"
              },
              "imageUrl": {
                "type": "string"
              },
              "quantity": {
                "type": "number"
              }
            }
          }
        },
        "receiptDate": {
          "type": "string"
        },
        "merchantName": {
          "type": "string"
        }
      }
    },
    "success": {
      "type": "boolean"
    },
    "merchant": {
      "type": "object",
      "required": [
        "displayName"
      ],
      "properties": {
        "logoUrl": {
          "type": "string"
        },
        "website": {
          "type": "string"
        },
        "displayName": {
          "type": "string"
        }
      }
    },
    "shipment": {
      "type": "object",
      "required": [
        "carrier",
        "trackingNumber",
        "status"
      ],
      "properties": {
        "status": {
          "type": "string"
        },
        "carrier": {
          "type": "string"
        },
        "lastUpdate": {
          "type": "string"
        },
        "productName": {
          "type": "string"
        },
        "trackingNumber": {
          "type": "string"
        },
        "estimatedDelivery": {
          "type": "string"
        }
      }
    },
    "aiInsights": {
      "type": "object",
      "required": [
        "summary"
      ],
      "properties": {
        "summary": {
          "type": "string"
        },
        "merchantType": {
          "type": "string"
        },
        "contextUpdate": {
          "type": "string"
        },
        "categoryReason": {
          "type": "string"
        },
        "categoryCorrect": {
          "type": "boolean"
        },
        "financeInsights": {
          "type": "array",
          "items": {
            "type": "object",
            "required": [
              "type",
              "insight"
            ],
            "properties": {
              "type": {
                "type": "string"
              },
              "insight": {
                "type": "string"
              },
              "actionable": {
                "type": "boolean"
              }
            }
          }
        },
        "recurringPattern": {
          "type": "string"
        },
        "suggestedCategory": {
          "type": "string"
        },
        "categoryConfidence": {
          "type": "number"
        }
      }
    },
    "transactionId": {
      "type": "string"
    }
  }
}
```

### handleWatchingTransactionsUpdate

**Description:** Receives watching transactions update result from Sidekick Task

**Input Schema:**

```json
{
  "type": "object",
  "required": [
    "results"
  ],
  "properties": {
    "results": {
      "type": "array",
      "items": {
        "type": "object",
        "required": [
          "transactionId",
          "trackingNumber",
          "previousStatus",
          "currentStatus",
          "watchStatus"
        ],
        "properties": {
          "notes": {
            "type": "string"
          },
          "watchStatus": {
            "anyOf": [
              {
                "type": "string",
                "const": "watching"
              },
              {
                "type": "string",
                "const": "closed"
              }
            ]
          },
          "deliveryDate": {
            "type": "string"
          },
          "currentStatus": {
            "type": "string"
          },
          "transactionId": {
            "type": "string"
          },
          "previousStatus": {
            "type": "string"
          },
          "trackingNumber": {
            "type": "string"
          },
          "estimatedDelivery": {
            "type": "string"
          }
        }
      }
    },
    "summary": {
      "type": "object",
      "required": [
        "total",
        "stillWatching",
        "nowClosed"
      ],
      "properties": {
        "total": {
          "type": "number"
        },
        "nowClosed": {
          "type": "number"
        },
        "stillWatching": {
          "type": "number"
        }
      }
    }
  }
}
```

### initiateAccountConnection

**Description:** Initiates a connection to a financial account and returns the secure link URL

**Input Schema:**

```json
{
  "type": "object",
  "properties": {}
}
```

### initiateAccountReauth

**Description:** Initiates re-authentication for a broken account connection (login_required status). Returns a secure link URL for the user to complete re-authentication.

**Input Schema:**

```json
{
  "type": "object",
  "required": [
    "itemId"
  ],
  "properties": {
    "itemId": {
      "type": "string",
      "description": "The item ID of the institution needing re-authentication"
    }
  }
}
```

### main

**Description:** Monthly spending review - analyzes last month's spending and creates a report

**Input Schema:**

```json
{
  "type": "object",
  "properties": {}
}
```

### monthlyInsightRegeneration

**Input Schema:**

```json
{
  "type": "object",
  "properties": {}
}
```

### regenerateInsights

**Description:** Regenerates financial insights, avoiding duplicates of previously surfaced insights

**Input Schema:**

```json
{
  "type": "object",
  "properties": {}
}
```

### resetEnrichmentData

**Description:** Resets all enrichment data (for testing). Optionally restarts initial enrichment.

**Input Schema:**

```json
{
  "type": "object",
  "properties": {
    "restart": {
      "type": "boolean",
      "default": false,
      "description": "If true, restart initial enrichment after reset"
    }
  }
}
```

### resetInsightsStatus

**Description:** Resets insights status to allow re-running

**Input Schema:**

```json
{
  "type": "object",
  "properties": {}
}
```

### restartStaleJob

**Description:** Manually restarts a stale enrichment job that lost connection

**Input Schema:**

```json
{
  "type": "object",
  "properties": {
    "jobId": {
      "type": "number",
      "description": "Specific job ID to restart, or most recent if omitted"
    }
  }
}
```

### setAppPrivacyMode

**Description:** Sets the privacy mode setting for the main app

**Input Schema:**

```json
{
  "type": "object",
  "required": [
    "enabled"
  ],
  "properties": {
    "enabled": {
      "type": "boolean",
      "description": "Whether app privacy mode is enabled"
    }
  }
}
```

### setPrivacyMode

**Description:** Sets the privacy mode setting for the widget

**Input Schema:**

```json
{
  "type": "object",
  "required": [
    "enabled"
  ],
  "properties": {
    "enabled": {
      "type": "boolean",
      "description": "Whether privacy mode is enabled"
    }
  }
}
```

### setTransactionCategory

**Description:** Set or confirm a transaction's category, marking it as manually categorized

**Input Schema:**

```json
{
  "type": "object",
  "required": [
    "transactionId"
  ],
  "properties": {
    "category": {
      "type": "string",
      "description": "New category to assign. If omitted, accepts the current category."
    },
    "transactionId": {
      "type": "string",
      "description": "The transaction ID to update"
    }
  }
}
```

### startImmediateFinancialInsights

**Description:** Starts immediate financial insights analysis for subscription savings, credit health, and smart insights

**Input Schema:**

```json
{
  "type": "object",
  "properties": {}
}
```

### startManualEnrichment

**Description:** Manually starts enrichment for all unenriched transactions

**Input Schema:**

```json
{
  "type": "object",
  "properties": {}
}
```

### talkWithSidekick

**Description:** Talk with Sidekick about a financial topic

**Input Schema:**

```json
{
  "type": "object",
  "required": [
    "context"
  ],
  "properties": {
    "context": {
      "type": "string",
      "description": "The context or question for Sidekick"
    }
  }
}
```

### trackEngagement

**Description:** Tracks a user engagement event (screen view, button tap, etc.)

**Input Schema:**

```json
{
  "type": "object",
  "required": [
    "event"
  ],
  "properties": {
    "event": {
      "type": "string",
      "description": "Event name: screen_view, button_tap, etc."
    },
    "screen": {
      "type": "string",
      "description": "Screen name, e.g. home, inbox, transactions"
    },
    "metadata": {
      "type": "object",
      "patternProperties": {
        "^(.*)$": {
          "type": "string"
        }
      }
    }
  }
}
```

### updateEnrichmentProgress

**Description:** Receives progress updates from Sidekick Task

**Input Schema:**

```json
{
  "type": "object",
  "required": [
    "status"
  ],
  "properties": {
    "status": {
      "type": "string",
      "description": "Current progress status message"
    }
  }
}
```

### updateWatchingTransactions

**Description:** Periodic job to update shipping status for watching transactions

**Input Schema:**

```json
{
  "type": "object",
  "properties": {}
}
```

