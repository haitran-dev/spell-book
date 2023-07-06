import React from "react";
import { Transition } from "react-transition-group";
import { CAMBRIDGE_DOMAIN } from "../constant";
import ArrowLeftSVG from "../svgs/arrow-left.svg";
import CloseSVG from "../svgs/close.svg";
import LinkSVG from "../svgs/link.svg";
import SettingSVG from "../svgs/setting.svg";
import VolumeSVG from "../svgs/volume.svg";
import { Meaning } from "../types/custom";
import Icon from "../ui/icon";
import { WidgetContext } from "./WidgetContext";
import Settings from "./Settings";
import { settingTypes } from "../constant/setting";
import Popover from "../ui/popover";
import Images from "./Images";
import Tabs from "../ui/tabs";

const DURATION = 300;

const defaultStyle = {
  transition: `transform ${DURATION}ms ease-out`,
  transform: "translateX(101%)",
};

const transitionStyles = {
  entering: { transform: "translateX(101%)" },
  entered: { transform: "translateX(0)" },
};

type BlockProps = {
  data?: any;
};

const Block: React.FC<BlockProps> = ({ data }) => {
  const audiosRef = React.useRef<Map<string, HTMLAudioElement>>(null);
  const { title, type, audios, meanings } = data;
  const widgets = React.useContext(WidgetContext) || [];
  const rootFontSize = widgets.find(
    (widget) => widget.name === settingTypes.FONT_SIZE,
  ).value;
  const audioVolume = widgets.find(
    (widget) => widget.name === settingTypes.VOLUME,
  ).value;

  React.useEffect(() => {
    // change sound volume
    if (!audiosRef) return;

    audiosRef.current?.forEach((audio) => {
      audio.volume = audioVolume;
    });
  }, [audioVolume]);

  const getAudioMap = () => {
    if (!audiosRef.current) {
      audiosRef.current = new Map();
    }

    return audiosRef.current;
  };

  const handlePlayAudio = (type: string) => {
    const audioEle = audiosRef.current.get(type);

    if (!audioEle) return;
    audioEle.play();
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "4px",
          marginBottom: "4px",
        }}
      >
        <p
          style={{
            fontSize: `${0.875 * +rootFontSize}px`,
            fontWeight: "600",
            fontStyle: "italic",
          }}
        >
          {type}
        </p>
        <div
          style={{
            display: "flex",
            gap: "16px",
          }}
        >
          {audios?.map((audio) => {
            const audioType = audio.type;

            if (!audioType) return null;

            return (
              <React.Fragment key={audioType}>
                <div
                  style={{
                    fontSize: `${rootFontSize}px`,
                    display: "flex",
                    gap: "4px",
                    alignItems: "center",
                  }}
                >
                  <p
                    style={{
                      fontWeight: 600,
                      textTransform: "uppercase",
                      lineHeight: 1,
                    }}
                  >
                    {audioType}
                  </p>
                  <Icon
                    onClick={() => handlePlayAudio(audioType)}
                    svg={VolumeSVG}
                    title={`${audioType.toUpperCase()} Voice`}
                  />
                  <span>{audio.pronunciation}</span>
                </div>
                <audio
                  ref={(node) => {
                    const audiosMap = getAudioMap();
                    if (node) {
                      audiosMap.set(audioType, node);
                    } else {
                      audiosMap.delete(audioType);
                    }
                  }}
                >
                  {audio.sources?.map((source) => (
                    <source
                      key={source.type}
                      type={source.type}
                      src={source.url}
                    />
                  ))}
                  audio {audioType}
                </audio>
              </React.Fragment>
            );
          })}
        </div>
      </div>
      <div className="meaning-block">
        {meanings.map((meaning, index) => {
          const id = crypto.randomUUID();
          return (
            <MeaningBlock
              key={id}
              meaning={meaning}
              rootFontSize={rootFontSize}
            />
          );
        })}
      </div>
    </>
  );
};

type MeaningBlockProps = {
  meaning: Meaning;
  rootFontSize: number;
};

const MeaningBlock: React.FC<MeaningBlockProps> = ({
  meaning,
  rootFontSize,
}) => {
  return (
    <div className="meaning-item">
      <p
        className="meaning-title"
        style={{
          fontSize: `${1.075 * rootFontSize}px`,
        }}
      >
        {meaning.text}
      </p>
      <div
        className="example-block"
        style={{
          fontSize: `${0.95 * rootFontSize}px`,
        }}
      >
        {meaning.examples.map((example, index) => (
          <p
            key={index}
            className="example-item"
            style={{
              fontSize: rootFontSize + "px",
            }}
          >
            &bull; {example}
          </p>
        ))}
      </div>
    </div>
  );
};

const App = ({ results, onGoBack, onClose, isFirstChild }) => {
  console.log({ results });
  const [isOpen, setOpen] = React.useState<boolean>(false);
  const widgets = React.useContext(WidgetContext) || [];
  const rootFontSize = widgets.find(
    (widget) => widget.name === settingTypes.FONT_SIZE,
  ).value;

  const word = results[0].title;

  React.useEffect(() => {
    // trigger animation
    setOpen(true);
  }, []);

  const handleCloseTab = () => {
    onGoBack();
    setOpen(false);
  };

  const handleCloseAllTabs = () => {
    onClose();
  };

  return (
    <Transition in={isOpen} timeout={DURATION}>
      {(state) => (
        <div
          className="aside-container"
          style={{
            ...defaultStyle,
            ...transitionStyles[state],
          }}
        >
          {!isFirstChild ? (
            <Icon
              onClick={handleCloseTab}
              className="close-icon"
              svg={ArrowLeftSVG}
              title="Back"
            />
          ) : null}
          <div className="setting-icon-wrapper">
            <Popover>
              <Popover.Trigger>
                <Icon
                  className="setting-icon"
                  svg={SettingSVG}
                  title="Settings"
                />
              </Popover.Trigger>
              <Popover.Body>
                <Settings />
              </Popover.Body>
            </Popover>
            <Icon
              onClick={handleCloseAllTabs}
              className="close-all-icon"
              svg={CloseSVG}
              title="Close all tabs"
            />
          </div>

          <Tabs defaultLabel="Definition">
            <Tabs.Labels>
              <Tabs.Label label="Definition" />
              <Tabs.Label label="Images" />
            </Tabs.Labels>
            <Tabs.Panels>
              <Tabs.Panel label="Definition">
                <div
                  style={{
                    display: "flex",
                    gap: "4px",
                    alignItems: "center",
                  }}
                >
                  <p
                    style={{
                      fontSize: `${1.875 * +rootFontSize}px`,
                      fontWeight: "600",
                    }}
                  >
                    {word}
                  </p>
                  <a
                    href={`${CAMBRIDGE_DOMAIN}/dictionary/english/${word}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Icon svg={LinkSVG} svgW={16} title="Original source" />
                  </a>
                </div>
                <div className="meaning-container">
                  {results.map((item, index) => (
                    <Block key={index} data={item} />
                  ))}
                </div>
              </Tabs.Panel>
              <Tabs.Panel label="Images">
                <Images word={word} />
              </Tabs.Panel>
            </Tabs.Panels>
          </Tabs>
        </div>
      )}
    </Transition>
  );
};

export default App;
