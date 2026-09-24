import type { Meta, StoryObj } from "@storybook/html-vite";
import { transfer, doc, type TransferArgs } from "@italia-daisy/recipes/components/transfer";
import { example, describe } from "./helpers";

const meta: Meta<TransferArgs> = {
  title: "Componenti/Transfer",
  tags: ["autodocs"],
  render: (args) => transfer(args),
  args: {"legend":"Uffici da cui ricevere comunicazioni","sourceTitle":"Disponibili","targetTitle":"Selezionati"},
  argTypes: {},
  parameters: { docs: { description: { component: describe(doc) } } },
};
export default meta;
type Story = StoryObj<TransferArgs>;

export const Playground: Story = {};

export const Base: Story = example(doc, "base");
export const Form: Story = example(doc, "form");
