import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  CheckCircle,
  Users,
  Trophy,
  Star,
  Award,
  Book,
  Cake,
  Cat,
  Heart,
} from "lucide-react";
import { Header } from "@/components/layout/header";
import { Character } from "@/components/ui/character";
import { Footer } from "@/components/layout/footer";

const Index = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative w-full overflow-hidden py-12 md:py-20 lg:py-28 cloud-bg">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:gap-16">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl text-primary">
                    Learn with Fun & Adventure!
                  </h1>
                  <p className="max-w-[600px] text-xl md:text-2xl text-foreground/80">
                    Join TradeSmartAI
                  </p>
                </div>
                <div className="flex flex-col gap-3 min-[400px]:flex-row">
                  <Link href="/register">
                    <Button
                      size="lg"
                      className="rounded-full text-lg font-bold px-8 py-6 bg-kid-yellow text-foreground hover:bg-kid-yellow/90"
                    >
                      Start Exploring
                    </Button>
                  </Link>
                  <Link href="/chat">
                    <Button
                      variant="outline"
                      size="lg"
                      className="rounded-full text-lg font-bold px-8 py-6 border-primary text-primary hover:bg-primary/10"
                    >
                      See All Courses
                    </Button>
                  </Link>
                </div>
                <div className="flex flex-wrap gap-4 pt-4">
                  <div className="flex items-center rounded-full bg-kid-blue/10 px-3 py-1">
                    <Star className="h-5 w-5 text-kid-blue mr-1" />
                    <span className="text-sm font-medium">
                      1000+ Fun Activities
                    </span>
                  </div>
                  <div className="flex items-center rounded-full bg-kid-orange/10 px-3 py-1">
                    <Cat className="h-5 w-5 text-kid-orange mr-1" />
                    <span className="text-sm font-medium">
                      Kid-friendly Design
                    </span>
                  </div>
                </div>
              </div>
              <div className="relative flex items-center justify-center lg:justify-end">
                <div className="relative w-full max-w-[400px]">
                  {/* Characters */}
                  <Character
                    className="absolute -top-4 -left-2 z-10"
                    color="blue"
                    animation="float"
                  />
                  <Character
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 z-20"
                    color="green"
                    animation="bounce"
                  />
                  <Character
                    className="absolute -bottom-8 -right-4 z-10"
                    color="yellow"
                    animation="wiggle"
                  />

                  {/* Background shape */}
                  <div className="h-[350px] w-[350px] rounded-full bg-gradient-to-br from-kid-blue/30 via-kid-purple/30 to-kid-pink/30 blur-3xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10"></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="w-full py-12 md:py-24 star-pattern">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-kid-yellow/10 px-3 py-1 text-sm text-kid-yellow">
                  Kid-Friendly Learning
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-foreground">
                  Designed for Young Explorers
                </h2>
                <p className="max-w-[900px] text-foreground/80 md:text-xl/relaxed">
                  Our platform makes learning exciting with interactive lessons,
                  colorful games, and friendly characters!
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Learning Interface Preview */}
        <section className="w-full py-12 md:py-24 bg-gradient-to-b from-white to-kid-blue/5">
          <div className="container px-4 md:px-6">
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-2 lg:gap-12">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <div className="inline-block rounded-lg bg-kid-purple/10 px-3 py-1 text-sm text-kid-purple">
                    Learning Made Fun
                  </div>
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                    Colorful Learning World
                  </h2>
                  <p className="max-w-[600px] text-foreground/80 md:text-xl/relaxed">
                    Step into a magical world where learning comes alive with
                    friendly characters, interactive lessons, and exciting
                    challenges!
                  </p>
                  <ul className="mt-6 space-y-3">
                    <li className="flex items-center space-x-3">
                      <div className="rounded-full bg-kid-green/20 p-1">
                        <CheckCircle className="h-5 w-5 text-kid-green" />
                      </div>
                      <span className="text-lg">Animated video lessons</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <div className="rounded-full bg-kid-green/20 p-1">
                        <CheckCircle className="h-5 w-5 text-kid-green" />
                      </div>
                      <span className="text-lg">Interactive storybooks</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <div className="rounded-full bg-kid-green/20 p-1">
                        <CheckCircle className="h-5 w-5 text-kid-green" />
                      </div>
                      <span className="text-lg">
                        Progress tracking with stars
                      </span>
                    </li>
                  </ul>
                </div>
                <div className="flex flex-col gap-3 min-[400px]:flex-row">
                  <Link href="/">
                    <Button
                      size="lg"
                      className="rounded-full bg-gradient-to-r from-kid-blue to-kid-purple text-white hover:opacity-90"
                    >
                      Try Demo Lesson
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="relative mx-auto w-full max-w-[500px] overflow-hidden rounded-[20px] border-4 border-white bg-white p-2 shadow-2xl">
                <div className="aspect-video w-full overflow-hidden rounded-[12px] bg-gradient-to-br from-kid-blue/20 to-kid-purple/20">
                  <div className="flex h-full flex-col">
                    <div className="flex border-b border-white/10 bg-white/5 px-4 py-2">
                      <div className="mr-2 h-3 w-3 rounded-full bg-red-400"></div>
                      <div className="mr-2 h-3 w-3 rounded-full bg-yellow-400"></div>
                      <div className="h-3 w-3 rounded-full bg-green-400"></div>
                    </div>
                    <div className="flex h-full">
                      <div className="w-1/4 border-r border-white/10 bg-white/10 p-3">
                        <div className="mb-3 h-6 w-full rounded-full bg-white/20"></div>
                        <div className="mb-3 h-6 w-full rounded-full bg-white/20"></div>
                        <div className="mb-3 h-6 w-full rounded-full bg-white/20"></div>
                        <div className="h-6 w-full rounded-full bg-white/20"></div>
                      </div>
                      <div className="relative flex-1 p-3">
                        <div className="absolute bottom-4 left-4 right-4 top-4 flex items-center justify-center rounded-xl bg-white/30 backdrop-blur-sm">
                          <div className="text-center">
                            <div className="mb-2 mx-auto h-12 w-12 rounded-full bg-kid-yellow flex items-center justify-center">
                              <svg
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path d="M8 5V19L19 12L8 5Z" fill="white" />
                              </svg>
                            </div>
                            <p className="font-bold text-white text-shadow">
                              Interactive Lesson
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="w-full py-12 md:py-24 bg-gradient-to-b from-kid-blue/5 to-white">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Ready to Start the{" "}
                  <span className="text-kid-blue">Learning Adventure?</span>
                </h2>
                <p className="mx-auto max-w-[700px] text-foreground/80 md:text-xl/relaxed">
                  Join thousands of happy kids who are having fun while learning
                  important skills for the future.
                </p>
              </div>
              <div className="flex flex-col gap-3 min-[400px]:flex-row">
                <Link href="/register">
                  <Button
                    size="lg"
                    className="rounded-full bg-kid-green hover:bg-kid-green/90 text-white text-lg font-bold px-8 py-6"
                  >
                    Begin Your Journey
                  </Button>
                </Link>
                <Link href="/">
                  <Button
                    variant="outline"
                    size="lg"
                    className="rounded-full text-lg font-bold px-8 py-6"
                  >
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      {/* <footer className="border-t bg-muted/30 py-8 md:py-12"> */}
      <Footer />
      {/* </footer> */}
    </div>
  );
};

export default Index;
