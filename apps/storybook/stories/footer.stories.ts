import type { Meta, StoryObj } from "@storybook/html-vite";
import { footer, doc, type FooterArgs } from "@italia-daisy/recipes/components/footer";
import { example, describe } from "./helpers";

const meta: Meta<FooterArgs> = {
  title: "Componenti/Footer",
  tags: ["autodocs"],
  render: (args) => footer(args),
  args: {"brand": "Lorem Ipsum", "tagline": "Inserire qui la tag line", "headingLevel": 2, "surface": "primary"},
  argTypes: {"brandIcon": {"control": "select", "options": ["it-code-circle", "it-pa", "it-designers-italia", "it-team-digitale"]}, "headingLevel": {"control": "inline-radio", "options": [2, 3]}, "surface": {"control": "inline-radio", "options": ["primary", "base"]}},
  parameters: { layout: "fullscreen", docs: { description: { component: describe(doc) } } },
};
export default meta;
type Story = StoryObj<FooterArgs>;

export const Playground: Story = {};

export const Completo: Story = example(doc, "completo");
export const Contatti: Story = example(doc, "contatti");
export const CompletoBase: Story = example(doc, "completo-base");
