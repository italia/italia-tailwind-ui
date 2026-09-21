import type { Meta, StoryObj } from "@storybook/html-vite";
import { megamenu, doc, type MegamenuArgs } from "@italia-daisy/recipes/components/megamenu";
import { example, describe } from "./helpers";

const meta: Meta<MegamenuArgs> = {
  title: "Componenti/Megamenu",
  tags: ["autodocs"],
  render: (args) =>
    `<div class="bg-primary text-primary-content"><nav class="mx-auto w-full max-w-[1320px] px-4"><ul class="menu menu-horizontal w-full gap-0 p-0"><li>${megamenu(args)}</li></ul></nav></div><div class="h-96"></div>`,
  args: {"label": "Megamenu", "columns": 2, "footerPosition": "bottom", "footerAlign": "left", "active": false, "disabled": false, "fullWidth": false},
  argTypes: {"columns": {"control": "inline-radio", "options": [1, 2, 3, 4]}, "footerPosition": {"control": "inline-radio", "options": ["bottom", "right"]}, "footerAlign": {"control": "inline-radio", "options": ["left", "right"]}},
  parameters: { layout: "fullscreen", docs: { description: { component: describe(doc) } } },
};
export default meta;
type Story = StoryObj<MegamenuArgs>;

export const Playground: Story = {};

export const Base: Story = example(doc, "base");
export const Completo: Story = example(doc, "completo");
export const Colonne: Story = example(doc, "colonne");
export const Esplora: Story = example(doc, "esplora");
export const CtaBasso: Story = example(doc, "cta-basso");
export const CtaDestra: Story = example(doc, "cta-destra");
export const Attivo: Story = example(doc, "attivo");
