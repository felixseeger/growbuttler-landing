'use client'

import { useMemo } from 'react'
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js'
import styles from './Pricing.module.scss'

interface PricingProps {
  title?: string
  description?: string
  benefits?: string[] | null
  priceAmount?: string
  pricePeriod?: string
  ctaLabel?: string
  disclaimer?: string
  paypalPlanId?: string
}

const defaultBenefits = [
  'Unlimited Journal-Einträge',
  'Expert-Directory-Zugriff',
  'Sofortiger Zugriff',
  'Community-Forum-Zugang',
]

export default function Pricing({
  title = 'Grüner Daumen Zugang',
  description = 'Nutzen Sie Expertenwissen und Tools, um Ihren Garten zu meistern.',
  benefits = defaultBenefits,
  priceAmount = '€9',
  pricePeriod = '/Monat',
  ctaLabel = 'Jetzt Zugang erhalten',
  disclaimer = 'Jederzeit kündbar.',
  paypalPlanId,
}: PricingProps) {
  const safeBenefits = Array.isArray(benefits) && benefits.length > 0 ? benefits : defaultBenefits
  const paypalClientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID
  const hasPayPal = Boolean(paypalClientId && paypalClientId.length > 10)
  const initialOptions = useMemo(
    () => ({
      clientId: paypalClientId!,
      currency: 'EUR',
      intent: 'subscription',
      vault: true,
    }),
    [paypalClientId]
  )

  return (
    <section className={styles.section}>
      <div className={styles.card}>
        <div className={styles.left}>
          <h2 className={styles.title}>{title}</h2>
          <p className={styles.desc}>{description}</p>
          <ul className={styles.list}>
            {safeBenefits.map((text, i) => (
              <li key={i} className={styles.item}>
                <span className={styles.check} aria-hidden>check_circle</span>
                <span>{text}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className={styles.right}>
          <span className={styles.period}>Monatlich</span>
          <div className={styles.priceWrap}>
            <span className={styles.price}>{priceAmount}</span>
            <span className={styles.priceMeta}>{pricePeriod}</span>
          </div>
          {hasPayPal ? (
            <PayPalScriptProvider options={initialOptions}>
              <div className={styles.paypalWrap}>
                <PayPalButtons
                  style={{ layout: 'vertical', color: 'gold', shape: 'rect', label: 'subscribe' }}
                  createSubscription={(_, actions) => {
                    return actions.subscription.create({
                      plan_id: paypalPlanId || 'P-XXX', // Replace with your PayPal plan ID from WordPress/backend
                    })
                  }}
                  onApprove={async (data) => {
                    console.log('Subscription approved:', data.subscriptionID)
                  }}
                />
              </div>
            </PayPalScriptProvider>
          ) : (
            <a href="/api/checkout?plan=monthly" className={styles.cta}>
              {ctaLabel}
            </a>
          )}
          <p className={styles.disclaimer}>{disclaimer}</p>
        </div>
      </div>
    </section>
  )
}
