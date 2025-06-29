"use client"

import type React from "react"
import {
  Elements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, CreditCard, Calendar, Lock } from "lucide-react"
import { getStripe } from "../../../../_lib_backend/stripe/frontendStripe"
import axiosClient from "@/lib/axios/axiosClient"
import { toastingError } from "@/lib/toast_message/toastingErrors"

const stripePromise = getStripe()

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      fontSize: "16px",
      color: "#424770",
      "::placeholder": {
        color: "#aab7c4",
      },
      fontFamily: "system-ui, -apple-system, sans-serif",
    },
    invalid: {
      color: "#9e2146",
    },
  },
}

interface SaveCardFormProps {
  onSuccess?: () => void
}

export default function SaveCardForm({ onSuccess }: SaveCardFormProps) {
  return (
    <Elements stripe={stripePromise}>
      <CardForm onSuccess={onSuccess} />
    </Elements>
  )
}

function CardForm({ onSuccess }: SaveCardFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [cardholderName, setCardholderName] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!stripe || !elements) return

    setLoading(true)
    setError(null)

    const cardNumberElement = elements.getElement(CardNumberElement)
    if (!cardNumberElement) {
      setError("Card element not found")
      setLoading(false)
      return
    }

    try {
      // Create Payment Method
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card: cardNumberElement,
        billing_details: {
          name: cardholderName,
        },
      })

      if (error) {
        setError(error.message || "An error occurred")
        setLoading(false)
        return
      }
      // Here you would typically send the paymentMethod.id to your backend
        await axiosClient.post("payment/stripe/save-card",{
        paymentMethodId: paymentMethod.id
      })
        onSuccess?.()
    } catch (err) {
      toastingError(`Failed to save card. Please try again, ${err}`)
    }finally{
        setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-4">
        {/* Cardholder Name */}
        <div className="space-y-2">
          <Label htmlFor="cardholder-name">Cardholder Name</Label>
          <Input
            id="cardholder-name"
            placeholder="John Doe"
            value={cardholderName}
            onChange={(e) => setCardholderName(e.target.value)}
            required
          />
        </div>

        {/* Card Number */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Card Number
          </Label>
          <div className="relative">
            <div className="border rounded-md px-3 py-2 bg-background">
              <CardNumberElement options={CARD_ELEMENT_OPTIONS} />
            </div>
          </div>
        </div>

        {/* Expiry and CVC */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Expiry Date
            </Label>
            <div className="border rounded-md px-3 py-2 bg-background">
              <CardExpiryElement options={CARD_ELEMENT_OPTIONS} />
            </div>
          </div>
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Lock className="h-4 w-4" />
              CVC
            </Label>
            <div className="border rounded-md px-3 py-2 bg-background">
              <CardCvcElement options={CARD_ELEMENT_OPTIONS} />
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="submit" disabled={!stripe || loading || !cardholderName.trim()} className="flex-1">
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving Card...
            </>
          ) : (
            <>
              <CreditCard className="mr-2 h-4 w-4" />
              Save Card
            </>
          )}
        </Button>
      </div>

      <div className="text-xs text-muted-foreground text-center">
        Your payment information is encrypted and processed securely by Stripe.
      </div>
    </form>
  )
}
