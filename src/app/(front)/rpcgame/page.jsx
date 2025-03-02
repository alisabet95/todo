import RockPaper from "./rpc";

export const metadata = {
  title: "Rock Paper Scissors",
  description: "this is Rock Paper Scissors Game. it belongs to Ali Sabet",
};

export default function RpsG() {
  return (
    <div>
      <h1 className="mb-5 mt-5 pt-5 pb-5">Rock-Paper-Scissors Game</h1>
      <RockPaper />
    </div>
  );
}
