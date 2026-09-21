import type { Meta, StoryObj } from "@storybook/html-vite";
import { pagination, doc, type PaginationArgs } from "@italia-daisy/recipes/components/pagination";
import { example, describe } from "./helpers";

const meta: Meta<PaginationArgs> = {
  title: "Componenti/Pagination",
  tags: ["autodocs"],
  render: (args) => pagination(args),
  args: {"current": 3, "total": 5, "visible": 5, "align": "center", "textLinks": false, "totalLabel": ""},
  argTypes: {"align": {"control": "select", "options": ["start", "center", "end"]}},
  parameters: { docs: { description: { component: describe(doc) } } },
};
export default meta;
type Story = StoryObj<PaginationArgs>;

export const Playground: Story = {};

export const Base: Story = example(doc, "base");
export const Testuali: Story = example(doc, "testuali");
export const Allineamento: Story = example(doc, "allineamento");
export const More: Story = example(doc, "more");
export const Simple: Story = example(doc, "simple");
export const Selettore: Story = example(doc, "selettore");
