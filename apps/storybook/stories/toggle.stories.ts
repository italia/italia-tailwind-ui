import type { Meta, StoryObj } from "@storybook/html-vite";
import { toggle, doc } from "@italia-daisy/recipes/components/toggle";
import type { ChoiceArgs } from "@italia-daisy/recipes/components/checkbox";
import { example, describe } from "./helpers";

const meta: Meta<ChoiceArgs> = {
  title: "Componenti/Toggle",
  tags: ["autodocs"],
  render: (args) => toggle(args),
  args: {"label":"Notifiche push","checked":false,"disabled":false,"labelFirst":true,"size":"default"},
  argTypes: {"size":{"control":"inline-radio","options":["sm","default","lg"]}},
  parameters: { docs: { description: { component: describe(doc) } } },
};
export default meta;
type Story = StoryObj<ChoiceArgs>;

export const Playground: Story = {};

export const Base: Story = example(doc, "base");
export const Gruppo: Story = example(doc, "gruppo");
export const EtichettaDestra: Story = example(doc, "etichetta-destra");
export const Disabilitato: Story = example(doc, "disabilitato");
export const Dimensioni: Story = example(doc, "dimensioni");
