import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function DashboardPage() {
  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Course</CardTitle>
            <CardDescription>Total courses enrolled</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Lessons</CardTitle>
            <CardDescription>Lessons completed</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12 / 36</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Exercises</CardTitle>
            <CardDescription>Exercises completed</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24 / 48</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
