import type { Meta, StoryObj } from "@storybook/html-vite";
import { header, doc, type HeaderArgs } from "@italia-daisy/recipes/components/header";
import { example, describe } from "./helpers";

const meta: Meta<HeaderArgs> = {
  title: "Componenti/Header",
  tags: ["autodocs"],
  render: (args) => header(args),
  args: {"owner": "Ente appartenenza", "title": "Nome dell'Istituzione", "tagline": "Tag line dell'Istituzione", "surface": "primary", "access": "button", "compact": false, "search": true, "shadow": false},
  argTypes: {"surface": {"control": "inline-radio", "options": ["primary", "base"]}, "access": {"control": "inline-radio", "options": ["button", "full", "none"]}, "brandIcon": {"control": "select", "options": ["it-pa", "it-designers-italia", "it-team-digitale", "it-code-circle"]}},
  parameters: { layout: "fullscreen", docs: { description: { component: describe(doc) } } },
};
export default meta;
type Story = StoryObj<HeaderArgs>;

export const Playground: Story = {};

export const Slim: Story = example(doc, "slim");
export const SlimFull: Story = example(doc, "slim-full");
export const SlimBase: Story = example(doc, "slim-base");
export const Centrale: Story = example(doc, "centrale");
export const CentraleCompatto: Story = example(doc, "centrale-compatto");
export const CentraleBase: Story = example(doc, "centrale-base");
export const Nav: Story = example(doc, "nav");
export const NavBase: Story = example(doc, "nav-base");
export const NavSecondaria: Story = example(doc, "nav-secondaria");
export const Completo: Story = example(doc, "completo");
export const CompletoBase: Story = example(doc, "completo-base");
