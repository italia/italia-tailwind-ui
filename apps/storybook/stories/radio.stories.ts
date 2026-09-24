import type { Meta, StoryObj } from "@storybook/html-vite";
import { radioGroup, doc } from "@italia-daisy/recipes/components/radio";
import type { ChoiceGroupArgs } from "@italia-daisy/recipes/components/checkbox";
import { example, describe } from "./helpers";

const meta: Meta<ChoiceGroupArgs> = {
  title: "Componenti/Radio",
  tags: ["autodocs"],
  render: (args) => radioGroup(args),
  args: {"legend":"Modalità di ritiro","inline":false,"disabled":false,"required":false},
  argTypes: {"state":{"control":"select","options":["valid","invalid"]}},
  parameters: { docs: { description: { component: describe(doc) } } },
};
export default meta;
type Story = StoryObj<ChoiceGroupArgs>;

export const Playground: Story = {};

export const Base: Story = example(doc, "base");
export const InLinea: Story = example(doc, "in-linea");
export const Descrizione: Story = example(doc, "descrizione");
export const Disabilitato: Story = example(doc, "disabilitato");
export const Dimensioni: Story = example(doc, "dimensioni");
export const Validazione: Story = example(doc, "validazione");
