import type { Meta, StoryObj } from "@storybook/html-vite";
import { rating, doc, type RatingArgs } from "@italia-daisy/recipes/components/rating";
import { example, describe } from "./helpers";

const meta: Meta<RatingArgs> = {
  title: "Componenti/Rating",
  tags: ["autodocs"],
  render: (args) => rating(args),
  args: {"legend":"Valuta il servizio","value":3,"max":5,"size":"md","readonly":false,"half":false,"disabled":false},
  argTypes: {"size":{"control":"inline-radio","options":["sm","md","lg"]}},
  parameters: { docs: { description: { component: describe(doc) } } },
};
export default meta;
type Story = StoryObj<RatingArgs>;

export const Playground: Story = {};

export const Base: Story = example(doc, "base");
export const SolaLettura: Story = example(doc, "sola-lettura");
export const MezzeStelle: Story = example(doc, "mezze-stelle");
export const Dimensioni: Story = example(doc, "dimensioni");
export const Disabilitato: Story = example(doc, "disabilitato");
