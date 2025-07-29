"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";

export function Content() {
  const [activeTab, setActiveTab] = useState("video");

  return (
    <Tabs
      value={activeTab}
      onValueChange={setActiveTab}
      className="flex-1 flex flex-col h-full"
    >
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="video">Video</TabsTrigger>
        <TabsTrigger value="exercise">Exercise</TabsTrigger>
        <TabsTrigger value="document">Document</TabsTrigger>
      </TabsList>
      <TabsContent value="video" className="flex-1 mt-4 overflow-auto">
        <div className="h-full bg-muted rounded-lg flex items-center justify-center">
          <div className="text-center">
            <Button
              variant="outline"
              size="icon"
              className="h-12 w-12 rounded-full mb-4"
            >
              <Play className="h-6 w-6" />
            </Button>
            <p className="text-sm text-muted-foreground">
              Video content will play here
            </p>
          </div>
        </div>
      </TabsContent>
      <TabsContent value="exercise" className="flex-1 mt-4 overflow-auto">
        <Card className="h-full p-6">
          <h3 className="text-lg font-semibold mb-4">
            Exercise: Solving Linear Equations
          </h3>
          <div className="space-y-4">
            <p>Solve the following equation for x:</p>
            <div className="p-4 bg-muted rounded-lg text-center">
              <span className="text-xl">2x + 5 = 15</span>
            </div>
            <div className="pt-4">
              <label className="text-sm font-medium">Your answer:</label>
              <div className="flex gap-2 mt-2">
                <input
                  type="text"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Enter your answer"
                />
                <Button>Submit</Button>
              </div>
            </div>
          </div>
        </Card>
      </TabsContent>
      <TabsContent value="document" className="flex-1 mt-4 overflow-auto">
        <Card className="h-full p-6">
          <h3 className="text-lg font-semibold mb-4">Algebra Fundamentals</h3>
          <div className="space-y-4">
            <p>
              Algebra is a branch of mathematics dealing with symbols and the
              rules for manipulating these symbols. In elementary algebra, those
              symbols (today written as Latin and Greek letters) represent
              quantities without fixed values, known as variables.
            </p>
            <h4 className="text-md font-semibold">Linear Equations</h4>
            <p>
              A linear equation is an equation that may be put in the form a₁x₁
              + a₂x₂ + ... + aₙxₙ + b = 0 where x₁, x₂, ..., xₙ are the
              variables (or unknowns), and a₁, a₂, ..., aₙ, b are the
              coefficients, which are often real numbers.
            </p>
            <div className="p-4 bg-muted rounded-lg">
              <p className="font-medium">Example:</p>
              <p className="mt-2">2x + 5 = 15</p>
              <p className="mt-2">2x = 10</p>
              <p className="mt-2">x = 5</p>
            </div>
          </div>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
