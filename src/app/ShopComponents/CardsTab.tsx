"use client";

import { useState } from "react";
import { CreditCard, Trash, X, Check, Shield, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import SaveCardForm from "./stripe/Card-form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { useGetCardQuery } from "../shop/redux/services/cardApi";
import Loader from "../Loader";
import { toastingError } from "@/lib/toast_message/toastingErrors";
import axiosClient from "@/lib/axios/axiosClient";

const getBrandIcon = (brand: string) => {
  const icons = {
    visa: "💳",
    mastercard: "💳",
    amex: "💳",
    discover: "💳",
    default: "💳",
  };
  return icons[brand.toLowerCase()] || icons.default;
};

const getBrandColor = (brand: string) => {
  const colors = {
    visa: "from-blue-500 to-blue-600",
    mastercard: "from-red-500 to-orange-500",
    amex: "from-green-500 to-teal-500",
    discover: "from-orange-500 to-amber-500",
    default: "from-gray-500 to-gray-600",
  };
  return colors[brand.toLowerCase()] || colors.default;
};

export default function CardsTab() {
  const [showAddCard, setShowAddCard] = useState(false);
  const { data: cards, isLoading, isSuccess } = useGetCardQuery();

  const setToDefaultCard = async (followingCardId) => {
    try {
      await axiosClient.post("payment/stripe/set-default-card", {
        cardId: followingCardId,
      });
    } catch (err) {
      toastingError(err);
    }
  };

  const removeCard = async(followingCardId) => {
    try {
      await axiosClient.delete("payment/stripe/delete-card",{
        data:{
          cardId: followingCardId,
        }
      });
    } catch (err) {
      toastingError(err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Payment Methods</h2>
          <p className="text-muted-foreground">
            Manage your saved payment methods
          </p>
        </div>
        <Button onClick={() => setShowAddCard(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Card
        </Button>
      </div>

      {/* Cards Grid */}
      {isLoading ? (
        <Loader />
      ) : !isSuccess ? (
        <p>Error loading cards.</p>
      ) : cards.all_Card.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="rounded-full bg-muted p-4 mb-4">
              <CreditCard className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No payment methods</h3>
            <p className="text-muted-foreground text-center mb-4 max-w-sm">
              Add a credit or debit card to make checkout faster and more
              secure.
            </p>
            <Button
              onClick={() => setShowAddCard(true)}
              variant="outline"
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Your First Card
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {cards.all_Card.map((card) => (
            <Card
              key={card.id}
              className={`relative overflow-hidden ${
                card.isDefault ? "ring-2 ring-primary" : ""
              }`}
            >
              <div
                className={`absolute inset-0 pointer-events-none bg-gradient-to-br ${getBrandColor(
                  card.brand
                )} opacity-5`}
              />
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{getBrandIcon(card.brand)}</div>
                    <div>
                      <CardTitle className="text-base capitalize">
                        {card.brand} •••• {card.last4}
                      </CardTitle>
                      <CardDescription>{card.holderName}</CardDescription>
                    </div>
                  </div>
                  {card.isDefault && (
                    <Badge variant="secondary" className="text-xs">
                      Default
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    Expires {card.expiryMonth}/{card.expiryYear}
                  </p>
                  <div className="flex gap-2">
                    {!card.isDefault && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-8 gap-1"
                        onClick={() => {
                          console.log("Clicked to set default:", card.id);
                          setToDefaultCard(card.id);
                        }}
                      >
                        Set Default
                      </Button>
                    )}
                    <Button
                    onClick={()=>removeCard(card.id)}
                      variant="ghost"
                      size="sm"
                      className="h-8 text-destructive hover:text-destructive"
                    >
                      <Trash className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add New Card Form */}
      {showAddCard && (
        <Card className="border-2 border-dashed border-primary/20">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Add New Payment Method
                </CardTitle>
                <CardDescription>
                  Your payment information is encrypted and secure
                </CardDescription>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAddCard(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <SaveCardForm onSuccess={() => setShowAddCard(false)} />
          </CardContent>
        </Card>
      )}

      {/* Security Notice */}
      <Alert>
        <Shield className="h-4 w-4" />
        <AlertDescription>
          <strong>Your security is our priority.</strong> All payment
          information is encrypted using industry-standard SSL technology. We
          never store your full card number or security code.
        </AlertDescription>
      </Alert>
    </div>
  );
}
