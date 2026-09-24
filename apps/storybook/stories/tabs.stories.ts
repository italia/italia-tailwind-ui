import type { Meta, StoryObj } from "@storybook/html-vite";
import { tabs, doc, type TabsArgs } from "@italia-daisy/recipes/components/tabs";
import { example, describe } from "./helpers";

const meta: Meta<TabsArgs> = {
  title: "Componenti/Tabs",
  tags: ["autodocs"],
  render: (args) => tabs(args),
  args: {"variant":"underline","fullWidth":false,"iconAbove":false},
  argTypes: {"variant":{"control":"inline-radio","options":["underline","card"]}},
  parameters: { docs: { description: { component: describe(doc) } } },
};
export default meta;
type Story = StoryObj<TabsArgs>;

export const Playground: Story = {};

export const Base: Story = example(doc, "base");
export const Icone: Story = example(doc, "icone");
export const IconaSopra: Story = example(doc, "icona-sopra");
export const SoloIcone: Story = example(doc, "solo-icone");
export const Schede: Story = example(doc, "schede");
export const TuttaLarghezza: Story = example(doc, "tutta-larghezza");
export const Link: Story = example(doc, "link");
export const Scuro: Story = example(doc, "scuro");
