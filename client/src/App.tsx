import { Button } from "./components/ui/button"

function App() {

  return (
    <>
      <div className="flex justify-center p-6 w-full ">
        <Button
          variant="default"
          size={"lg"}
          className="rounded-full"
          onClick={() => alert("Clicked")}
        >
          Click me
        </Button>
      </div>
    </>
  );
}

export default App
