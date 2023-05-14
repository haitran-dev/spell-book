import React from 'react';
import { Transition } from 'react-transition-group';
import { CAMBRIDGE_DOMAIN } from '../constant';
import ArrowLeftSVG from '../svgs/arrow-left.svg';
import CloseSVG from '../svgs/close.svg';
import LinkSVG from '../svgs/link.svg';
import SettingSVG from '../svgs/setting.svg';
import VolumeSVG from '../svgs/volume.svg';
import { Meaning } from '../types/custom';
import Icon from '../ui/icon';
import { WidgetContext } from './WidgetContext';
import Settings from './Settings';
import { settingTypes } from '../constant/setting';
import Popover from '../ui/popover';

const DURATION = 300;

const defaultStyle = {
	transition: `transform ${DURATION}ms ease-out`,
	transform: 'translateX(101%)',
};

const transitionStyles = {
	entering: { transform: 'translateX(101%)' },
	entered: { transform: 'translateX(0)' },
};

const App = ({ data, onClose, onGoBack, isFirstChild }) => {
	const audiosRef = React.useRef<Map<string, HTMLAudioElement>>(null);
	const [isOpen, setOpen] = React.useState<boolean>(false);
	const { type, audios, meanings } = data;
	const widgets = React.useContext(WidgetContext);
	const rootFontSize = widgets.find((widget) => widget.name === settingTypes.FONT_SIZE).value;
	const audioVolume = widgets.find((widget) => widget.name === settingTypes.VOLUME).value;

	React.useEffect(() => {
		// trigger animation
		setOpen(true);
	}, []);

	React.useEffect(() => {
		// change sound volume
		if (!audiosRef) return;

		audiosRef.current.forEach((audio) => {
			audio.volume = audioVolume;
		});
	}, [audioVolume]);

	const getAudioMap = () => {
		if (!audiosRef.current) {
			audiosRef.current = new Map();
		}

		return audiosRef.current;
	};

	const handleCloseTab = () => {
		onGoBack();
		setOpen(false);
	};

	const handleCloseAllTabs = () => {
		onClose();
	};

	const handlePlayAudio = (type: string) => {
		const audioEle = audiosRef.current.get(type);

		if (!audioEle) return;
		audioEle.play();
	};

	return (
		<Transition in={isOpen} timeout={DURATION}>
			{(state) => (
				<div
					style={{
						...defaultStyle,
						...transitionStyles[state],
					}}
					className='h-full text-dark-txt absolute inset-0 bg-[hsl(230,10%,97%,0.9)] backdrop-blur-md px-3 pt-10 pb-2 flex-column gap-2 border-l border-solid border-line'
				>
					{!isFirstChild ? (
						<Icon
							onClick={handleCloseTab}
							className='absolute top-1 left-1 border border-solid border-line border-opacity-30 rounded bg-white/30 hover:bg-white duration-200'
							svg={ArrowLeftSVG}
							title='Back'
						/>
					) : null}
					<Popover className='absolute top-1 right-10'>
						<Popover.Trigger>
							<Icon
								className='border border-solid border-line border-opacity-30 rounded bg-white/30 hover:bg-white duration-200'
								svg={SettingSVG}
								title='Settings'
							/>
						</Popover.Trigger>
						<Popover.Body>
							<Settings />
						</Popover.Body>
					</Popover>
					<Icon
						onClick={handleCloseAllTabs}
						className='absolute top-1 right-1 text-danger border border-solid border-line border-opacity-30 rounded bg-white/30 hover:bg-white duration-200'
						svg={CloseSVG}
						title='Close all tabs'
					/>
					<div className='flex gap-1 items-center'>
						<p
							style={{
								fontSize: `${1.875 * +rootFontSize}px`,
							}}
							className='font-bold'
						>
							{data.title}
						</p>
						<a
							href={`${CAMBRIDGE_DOMAIN}/dictionary/english/${data.title}`}
							target='_blank'
							rel='noopener noreferrer'
						>
							<Icon svg={LinkSVG} svgW={16} title='Original source' />
						</a>
					</div>
					<p
						style={{
							fontSize: `${0.875 * +rootFontSize}px`,
						}}
						className='font-semibold italic'
					>
						{type}
					</p>
					<div className='flex gap-4'>
						{audios?.map((audio) => {
							const audioType = audio.type;

							if (!audioType) return null;

							return (
								<React.Fragment key={audioType}>
									<div
										style={{
											fontSize: `${rootFontSize}px`,
										}}
										className='flex gap-1 items-center'
									>
										<p className='font-semibold uppercase'>{audioType}</p>
										<Icon
											onClick={() => handlePlayAudio(audioType)}
											svg={VolumeSVG}
											title={`${audioType.toUpperCase()} Voice`}
										/>
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
					<div
						id='visual-english-ext-scrollbar'
						className='flex-col gap-[6px] w-full pr-3 -mr-2'
					>
						{meanings.map((meaning, index) => {
							const id = crypto.randomUUID();
							const isFirstItem = index === 0;
							return (
								<MeaningBlock
									key={id}
									meaning={meaning}
									isFirstItem={isFirstItem}
									rootFontSize={rootFontSize}
								/>
							);
						})}
					</div>
				</div>
			)}
		</Transition>
	);
};

type MeaningBlockProps = {
	meaning: Meaning;
	isFirstItem: boolean;
	rootFontSize: number;
};

const MeaningBlock: React.FC<MeaningBlockProps> = ({ meaning, isFirstItem, rootFontSize }) => {
	return (
		<div className='space-y-2 mb-2'>
			{!isFirstItem && (
				<div className='h-[1px] w-[calc(100% + 12px)] -ml-[6px] -mr-[6px] bg-line' />
			)}
			<p
				style={{
					fontSize: `${1.075 * rootFontSize}px`,
				}}
				className='font-semibold'
			>
				{meaning.text}
			</p>
			<div
				style={{
					fontSize: `${0.95 * rootFontSize}px`,
				}}
				className='flex-column gap-1'
			>
				{meaning.examples.map((example, index) => (
					<p key={index} className='ml-4 my-0'>
						&bull; {example}
					</p>
				))}
			</div>
		</div>
	);
};

export default App;
