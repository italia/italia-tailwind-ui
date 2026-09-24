import type { Meta, StoryObj } from "@storybook/html-vite";
import { uploadDropzone, doc, type UploadArgs } from "@italia-daisy/recipes/components/upload";
import { example, describe } from "./helpers";

const meta: Meta<UploadArgs> = {
  title: "Componenti/Upload",
  tags: ["autodocs"],
  render: (args) => uploadDropzone(args),
  args: {"label":"Trascina qui i file","required":false,"multiple":true,"disabled":false},
  argTypes: {},
  parameters: { docs: { description: { component: describe(doc) } } },
};
export default meta;
type Story = StoryObj<UploadArgs>;

export const Playground: Story = {};

export const Base: Story = example(doc, "base");
export const Trascinamento: Story = example(doc, "trascinamento");
export const Elenco: Story = example(doc, "elenco");
export const Avatar: Story = example(doc, "avatar");
