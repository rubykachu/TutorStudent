import {
  Fox,
  Prince,
} from "@/visuals/literature/neu-cau-muon-co-mot-nguoi-ban/parts";

// The fox and the little prince as the lesson's visuals draw them, in every
// mood, for this lesson's videos (window.FIGURES, see video/lib/compose.ts).
// Sized by the composition's `.face` rule.
const figures = {
  "fox-calm": <Fox mood="calm" className="face" />,
  "fox-happy": <Fox mood="happy" className="face" />,
  "fox-sad": <Fox mood="sad" className="face" />,
  "prince-calm": <Prince mood="calm" className="face" />,
  "prince-happy": <Prince mood="happy" className="face" />,
  "prince-sad": <Prince mood="sad" className="face" />,
};

export default figures;
