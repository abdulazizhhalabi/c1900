---
topic: derivatives
title: Derivatives
examWeight: "5–8% (approximate)"
order: 8
---

## Overview

Derivatives are contracts whose value is derived from an underlying asset, rate, or index. The Level I curriculum covers the four main instrument types — forwards, futures, options, and swaps — focusing on payoff structures, pricing, and risk management applications. Questions mix conceptual understanding with payoff calculations.

## Forwards and Futures

A **forward contract** is a bilateral agreement to buy or sell an asset at a specified price (forward price) on a future date. No cash changes hands at initiation; settlement occurs at expiration. Forward contracts are traded OTC and expose both counterparties to credit risk.

**Futures contracts** are standardized forwards traded on exchanges. Daily mark-to-market and margin requirements (initial margin, maintenance margin) almost eliminate credit risk but introduce basis risk. A margin call is triggered when the account balance falls below the maintenance margin.

The no-arbitrage forward price for a non-dividend-paying asset: F₀ = S₀ × (1+r)ᵀ, where S₀ is the spot price and r is the risk-free rate for the period T.

## Options

An **option** gives the buyer the right, but not the obligation, to buy (call) or sell (put) an underlying asset at the strike price K before or at expiration.

**Payoffs at expiration:**
- Long call: max(ST − K, 0)
- Long put: max(K − ST, 0)
- Short call: −max(ST − K, 0)
- Short put: −max(K − ST, 0)

**Put-call parity** (for European options): C − P = S₀ − K/(1+r)ᵀ. Violations create arbitrage opportunities.

**Option value components:**
- **Intrinsic value:** The immediate exercise value — max(S − K, 0) for a call
- **Time value:** The option premium above intrinsic value, reflecting the possibility of future favorable moves

Options prices increase with volatility, time to expiration, and (for calls) the underlying price.

## Swaps

A **swap** is an agreement to exchange cash flows based on different underlying references. In a **plain-vanilla interest rate swap**, one party pays a fixed rate and receives a floating rate (LIBOR/SOFR) on the same notional principal. Swaps are used to convert fixed-rate liabilities to floating, or vice versa.

**Currency swaps** exchange cash flows denominated in different currencies. **Equity swaps** exchange a return tied to an equity index for a fixed or floating rate.
