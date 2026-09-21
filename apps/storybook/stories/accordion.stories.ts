import type { Meta, StoryObj } from "@storybook/html-vite";
import { accordion, doc, type AccordionArgs } from "@italia-daisy/recipes/components/accordion";
import { example, describe } from "./helpers";

const meta: Meta<AccordionArgs> = {
  title: "Componenti/Accordion",
  tags: ["autodocs"],
  render: (args) => accordion(args),
  args: {"single": false, "backgroundActive": false, "backgroundHover": false, "leftIcon": false},
  argTypes: {},
  parameters: { docs: { description: { component: describe(doc) } } },
};
export default meta;
type Story = StoryObj<AccordionArgs>;

export const Playground: Story = {};

export const Base: Story = example(doc, "base");
export const Esclusiva: Story = example(doc, "esclusiva");
export const Annidati: Story = example(doc, "annidati");
export const SfondoAttivo: Story = example(doc, "sfondo-attivo");
export const Hover: Story = example(doc, "hover");
export const IconaSinistra: Story = example(doc, "icona-sinistra");
