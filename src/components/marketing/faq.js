import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function FAQ() {
  const faqItems = [
    {
      question: "How does SolowCrew work?",
      answer: "SolowCrew creates 'deal pools' that let solo travelers combine their buying power to unlock group discounts, without actually having to travel together. You browse deals, join a pool with no upfront payment, and only pay once the minimum group size is reached. Then you travel independently while enjoying group rates."
    },
    {
      question: "Do I have to travel with others to get the discount?",
      answer: "Not at all! That's the beauty of SolowCrew. You get the group discount rates but you travel completely independently. You can choose to connect with other travelers in your pool if you want to, but it's entirely optional."
    },
    {
      question: "When do I need to pay for my booking?",
      answer: "You only pay once your deal pool reaches the minimum number of travelers needed to unlock the discount. You'll be notified when this happens and given a time window to complete your booking. If the minimum isn't reached before the deal expires, you won't be charged anything."
    },
    {
      question: "What happens if I need to cancel my trip?",
      answer: "Cancellation policies vary by travel provider. Once you've paid and confirmed your booking, the provider's standard cancellation policies apply. These details are always clearly stated on the deal page before you commit to booking."
    },
    {
      question: "How do you select your travel providers?",
      answer: "We carefully vet all travel providers on our platform. They must meet our standards for quality, reliability, and customer service. We also collect and monitor reviews from travelers who book through SolowCrew to ensure ongoing quality."
    },
    {
      question: "Is my payment secure?",
      answer: "Absolutely. We use industry-standard SSL encryption and secure payment processing through Stripe. We never store your full payment details on our servers."
    },
    {
      question: "Can I join multiple deal pools at once?",
      answer: "Yes, you can join as many pools as you're interested in. Just remember that if multiple pools reach their minimum travelers at the same time, you'll need to decide which ones to book and pay for."
    },
    {
      question: "What destinations do you currently offer?",
      answer: "We offer deals in popular destinations across six continents. Our selection is constantly growing as we partner with more travel providers. You can browse all available destinations on our Explore page."
    }
  ];

  return (
    <div className="container mx-auto px-4 py-20">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h2 className="text-3xl font-bold mb-4">
          Frequently Asked Questions
        </h2>
        <p className="text-muted-foreground text-lg">
          Got questions about SolowCrew? Find answers to the most common queries below.
        </p>
      </div>
      
      <div className="max-w-3xl mx-auto">
        <Accordion type="single" collapsible className="w-full">
          {faqItems.map((item, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left">
                {item.question}
              </AccordionTrigger>
              <AccordionContent>
                <p className="text-muted-foreground">
                  {item.answer}
                </p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}
