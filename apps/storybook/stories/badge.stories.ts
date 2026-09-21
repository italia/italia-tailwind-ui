import type { Meta, StoryObj } from "@storybook/html-vite";
import { badge, doc, type BadgeArgs } from "@italia-daisy/recipes/components/badge";
import { example, describe } from "./helpers";

const meta: Meta<BadgeArgs> = {
  title: "Componenti/Badge",
  tags: ["autodocs"],
  render: (args) => badge(args),
  args: {"label": "New", "variant": "secondary", "pill": false},
  argTypes: {"variant": {"control": "select", "options": ["primary", "secondary", "success", "danger", "warning", "inverse"]}},
  parameters: { docs: { description: { component: describe(doc) } } },
};
export default meta;
type Story = StoryObj<BadgeArgs>;

export const Playground: Story = {};

export const Dimensione: Story = example(doc, "dimensione");
export const Colori: Story = example(doc, "colori");
export const Arrotondati: Story = example(doc, "arrotondati");
export const Link: Story = example(doc, "link");
