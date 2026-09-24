import type { Meta, StoryObj } from "@storybook/html-vite";
import { video, doc, type VideoArgs } from "@italia-daisy/recipes/components/video";
import { example, describe } from "./helpers";

const meta: Meta<VideoArgs> = {
  title: "Componenti/Video",
  tags: ["autodocs"],
  render: (args) => video(args),
  args: {"title":"Un fiore in primavera","ratio":"16/9"},
  argTypes: {"ratio":{"control":"inline-radio","options":["16/9","4/3","1/1","21/9"]}},
  parameters: { docs: { description: { component: describe(doc) } } },
};
export default meta;
type Story = StoryObj<VideoArgs>;

export const Playground: Story = {};

export const Base: Story = example(doc, "base");
export const Proporzioni: Story = example(doc, "proporzioni");
export const Youtube: Story = example(doc, "youtube");
