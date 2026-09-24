import type { Meta, StoryObj } from "@storybook/html-vite";
import { forward, doc, type ForwardArgs } from "@italia-daisy/recipes/components/forward";
import { example, describe } from "./helpers";

const meta: Meta<ForwardArgs> = {
  title: "Componenti/Forward",
  tags: ["autodocs"],
  render: (args) => forward(args),
  args: {"href":"#contenuto","label":"Vai al contenuto successivo","size":"default","inverse":false},
  argTypes: {"size":{"control":"inline-radio","options":["default","lg"]}},
  parameters: { docs: { description: { component: describe(doc) } } },
};
export default meta;
type Story = StoryObj<ForwardArgs>;

export const Playground: Story = {};

export const Base: Story = example(doc, "base");
export const Hero: Story = example(doc, "hero");
