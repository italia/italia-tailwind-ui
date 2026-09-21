import type { Meta, StoryObj } from "@storybook/html-vite";
import { breadcrumbs, doc, type BreadcrumbsArgs } from "@italia-daisy/recipes/components/breadcrumbs";
import { example, describe } from "./helpers";

const meta: Meta<BreadcrumbsArgs> = {
  title: "Componenti/Breadcrumbs",
  tags: ["autodocs"],
  render: (args) => breadcrumbs(args),
  args: {"separator": "slash", "dark": false},
  argTypes: {"separator": {"control": "select", "options": ["slash", "chevron"]}},
  parameters: { docs: { description: { component: describe(doc) } } },
};
export default meta;
type Story = StoryObj<BreadcrumbsArgs>;

export const Playground: Story = {};

export const Base: Story = example(doc, "base");
export const Icona: Story = example(doc, "icona");
export const Separatore: Story = example(doc, "separatore");
export const Scuro: Story = example(doc, "scuro");
