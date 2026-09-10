---
topic: fixed-income
title: Fixed Income
examWeight: "10–12% (approximate)"
order: 7
---

## Overview

Fixed Income is one of the most calculation-intensive topics on Level I. Candidates must understand bond pricing, yield measures, interest rate risk (duration and convexity), credit risk, and the term structure of interest rates. The ability to move between price, yield, and duration is essential.

## Bond Pricing

A bond's price is the present value of its cash flows discounted at the required yield:

P = Σ [C / (1+r)ᵗ] + [FV / (1+r)ᴺ]

where C is the coupon payment, r is the periodic discount rate, and FV is the face value at maturity. Bonds trade at a premium when coupon > yield, at par when coupon = yield, and at a discount when coupon < yield.

**Accrued interest** is the interest that has accumulated since the last coupon date. The full price (dirty price) = flat price + accrued interest.

## Yield Measures

- **Current yield:** Annual coupon / flat price
- **Yield to maturity (YTM):** The IRR that equates the full price to all future cash flows — the most important yield measure
- **Yield to call (YTC):** Computed like YTM but assumes the bond is called at the first call date and call price
- **Street convention YTM** assumes coupons are reinvested at the YTM — an assumption that rarely holds in practice

## Duration and Convexity

**Modified duration** measures the percentage price change per 1% change in yield:
ΔP/P ≈ −D_mod × Δy

Duration is an approximation; convexity captures the curvature. For a given Δy:
ΔP/P ≈ −D_mod × Δy + ½ × C × (Δy)²

Longer maturities and lower coupons produce higher duration (more interest rate sensitivity). Zero-coupon bonds have duration equal to their maturity.

**Dollar duration (DV01):** The dollar change in price for a 1 basis point (0.01%) change in yield. Widely used by portfolio managers to measure absolute rate risk.

## Credit Risk

**Credit risk** is the risk of loss from a borrower's failure to make promised payments. Key concepts:
- **Probability of default (PD):** Likelihood the issuer fails to pay
- **Loss given default (LGD):** Percentage of exposure lost if default occurs
- **Expected loss = PD × LGD**

Credit ratings from Moody's, S&P, and Fitch provide an ordinal measure of credit quality. Investment-grade bonds are rated BBB−/Baa3 or above; below that threshold they are speculative-grade (high yield).

## Term Structure of Interest Rates

The **yield curve** plots yields against maturities for bonds of similar credit quality. A normal (upward-sloping) curve reflects the liquidity premium — investors demand higher yields for longer commitments. An inverted curve has historically preceded recessions.

The **pure expectations theory** holds that forward rates are unbiased predictors of future spot rates. The **liquidity preference theory** adds a term premium to compensate for interest rate uncertainty over time.
