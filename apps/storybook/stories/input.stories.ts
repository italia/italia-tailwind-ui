import type { Meta, StoryObj } from "@storybook/html-vite";
import { input, doc, type InputArgs } from "@italia-daisy/recipes/components/input";
import { example, describe } from "./helpers";

const meta: Meta<InputArgs> = {
  title: "Componenti/Input",
  tags: ["autodocs"],
  render: (args) => input(args),
  args: {"label":"Nome","placeholder":"Mario","type":"text","size":"default","disabled":false,"readonly":false,"required":false,"floating":false,"textarea":false},
  argTypes: {"type":{"control":"select","options":["text","email","password","number","tel","url","search","date","time"]},"size":{"control":"inline-radio","options":["sm","default","lg"]},"state":{"control":"select","options":["valid","invalid"]},"icon":{"control":"select","options":["it-search","it-mail","it-user","it-calendar"]}},
  parameters: { docs: { description: { component: describe(doc) } } },
};
export default meta;
type Story = StoryObj<InputArgs>;

export const Playground: Story = {};

export const Base: Story = example(doc, "base");
export const Tipi: Story = example(doc, "tipi");
export const AreaTesto: Story = example(doc, "area-testo");
export const Stati: Story = example(doc, "stati");
export const Dimensioni: Story = example(doc, "dimensioni");
export const Icone: Story = example(doc, "icone");
export const Pulsante: Story = example(doc, "pulsante");
export const Validazione: Story = example(doc, "validazione");
export const ValidazioneNativa: Story = example(doc, "validazione-nativa");
export const EtichettaFlottante: Story = example(doc, "etichetta-flottante");
