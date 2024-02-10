import React from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { string, z } from "zod";
import FadeIn from "../Animation/FadeIn";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input, Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createSearchParams, useNavigate, useSearchParams } from "react-router-dom";

const FormSchema = z.object({
  type_workout: z.string({
    required_error: "Please select a workout type.",
  }),
  num_days: z.string({ required_error: "Please select a number of days." }),
});

export default function Options() {
  const [params] = useSearchParams('difficulty');
  const difficulty = params.get('difficulty')?.toString() || "beginner";
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  function onSubmit(values: z.infer<typeof FormSchema>) {
    navigate({
      pathname: "/workout",
      search: createSearchParams({
        difficulty: difficulty,
        type_workout: values.type_workout,
        num_days: values.num_days,
      }).toString(),
    });
    
  //  const response = await sendWorkoutPlanRequest(difficulty, values.type_workout, values.num_days);
  //  console.log(response['choices'][0]['message']['content'])
  }

  return (
    <div className="flex flex-col w-[40%] h-screen justify-center pb-36">
      <h3 className="text-3xl mb-10">Tell us a bit more:</h3>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="type_workout"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-lg">Type of Workout</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a workout type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Weightlifting">Weightlifting</SelectItem>
                    <SelectItem value="Cardio">Cardio</SelectItem>
                    <SelectItem value="Calisthenics">Calisthenics</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="num_days"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-lg">Number of Days</FormLabel>
                <Input type="number" {...field} />
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="w-full flex justify-center">
            <Button size="lg" type="submit" className="text-xl border-2">
              Submit
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
