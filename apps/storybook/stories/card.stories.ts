import type { Meta, StoryObj } from "@storybook/html-vite";
import { card, doc, type CardArgs } from "@italia-daisy/recipes/components/card";
import { example, describe } from "./helpers";

const meta: Meta<CardArgs> = {
  title: "Componenti/Card",
  tags: ["autodocs"],
  render: (args) => `<div class="max-w-sm">${card(args)}</div>`,
  args: {"title": "Titolo del contenuto", "category": "Categoria", "date": "22 aprile 2026", "image": "https://picsum.photos/seed/city/800/600", "borderTop": "none", "shadow": "sm", "inline": false},
  argTypes: {"borderTop": {"control": "select", "options": ["none", "primary", "secondary", "success", "danger", "warning"]}, "shadow": {"control": "select", "options": ["none", "sm", "md", "lg"]}},
  parameters: { docs: { description: { component: describe(doc) } } },
};
export default meta;
type Story = StoryObj<CardArgs>;

export const Playground: Story = {};

export const Editoriali: Story = example(doc, "editoriali");
export const Featured: Story = example(doc, "featured");
export const Inline: Story = example(doc, "inline");
export const BordiOmbre: Story = example(doc, "bordi-ombre");
export const Profili: Story = example(doc, "profili");
export const Banner: Story = example(doc, "banner");
export const Azioni: Story = example(doc, "azioni");
