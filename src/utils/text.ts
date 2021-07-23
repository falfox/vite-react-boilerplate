export const formatText = (
  text: string,
  excelsData: {
    mapping: { [key: string]: number };
    data: string[][];
  },
  index: number // index based on recipient list
) => {
  // use <<<one|two|word>>> to randomly get a word
  const formatted = text.replace(
    /<<<([0-9a-zA-Z ]*(\|[0-9a-zA-Z ]*)+)>>>/gm,
    function (_, p) {
      // Parse spintext
      const vocabs = p.split("|");

      return vocabs[Math.floor(Math.random() * vocabs.length)];
    }
  );

  const { mapping, data } = excelsData;

  console.log({
    mapping,
  });

  return formatted.replace(
    /<<<([0-9a-zA-Z ]*([0-9a-zA-Z ]+)+)>>>/gm,
    function (_, p) {
      console.log({
        p,
      });
      console.log({
        mapppingP: mapping[p],
      });

      if (mapping[p] === undefined) {
        return "";
      }

      console.log({
        mapppingP: mapping[p],
      });
      const [, ...rest] = data;
      const row = rest[index];

      if (!row) return "";

      console.log({
        row,
      });

      return row[mapping[p]];
    }
  );
};
