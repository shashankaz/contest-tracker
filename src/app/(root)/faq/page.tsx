import Navbar from "@/components/Navbar";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { faqs } from "./faq";

const FAQ = () => {
  return (
    <div className="min-h-screen px-4 sm:px-6 md:px-8 lg:px-10 pb-10">
      <Navbar />
      <div className="h-20 flex items-center">
        <h1 className="text-3xl md:text-4xl font-semibold font-serif">FAQs</h1>
      </div>
      <div className="space-y-3">
        <Accordion type="single" collapsible>
          {faqs.map((faq, index) => (
            <AccordionItem value={`item-${index}`} key={index}>
              <AccordionTrigger>{faq.question}</AccordionTrigger>
              <AccordionContent>{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
};

export default FAQ;
