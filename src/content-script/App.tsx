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
import Images from './Images';
import Tabs from '../ui/tabs';

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
					className='h-full text-dark-txt absolute inset-0 bg-main backdrop-blur-md px-2 pt-10 pb-2 flex-column gap-2 border-l border-solid border-line'
				>
					{!isFirstChild ? (
						<Icon
							onClick={handleCloseTab}
							className='absolute top-1 left-1 border border-solid border-line rounded bg-white duration-200'
							svg={ArrowLeftSVG}
							title='Back'
						/>
					) : null}
					<div className='absolute top-1 right-1 flex gap-1 items-center'>
						<Popover>
							<Popover.Trigger>
								<Icon
									className='border border-solid border-line rounded bg-white duration-200'
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
							className='text-danger border border-solid border-line rounded bg-white duration-200'
							svg={CloseSVG}
							title='Close all tabs'
						/>
					</div>
					<Tabs defaultLabel='Text'>
						<Tabs.Labels>
							<Tabs.Label label='Text' />
							<Tabs.Label label='Image' />
						</Tabs.Labels>
						<Tabs.Panels>
							<Tabs.Panel label='Text'>
								<div className='flex flex-col gap-1 mb-1'>
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
														<p className='font-semibold uppercase'>
															{audioType}
														</p>
														<Icon
															onClick={() =>
																handlePlayAudio(audioType)
															}
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
								</div>
								<div
									id='visual-english-ext-scrollbar'
									className='flex-col gap-[6px] w-full pr-2 -mr-1'
								>
									{meanings.map((meaning, index) => {
										const id = crypto.randomUUID();
										const isFirstItem = index === 0;
										return (
											<MeaningBlock
												key={id}
												meaning={meaning}
												rootFontSize={rootFontSize}
											/>
										);
									})}
								</div>
							</Tabs.Panel>
							<Tabs.Panel label='Image'>
								<Images word={data.title} />
							</Tabs.Panel>
						</Tabs.Panels>
					</Tabs>
				</div>
			)}
		</Transition>
	);
};

type MeaningBlockProps = {
	meaning: Meaning;
	rootFontSize: number;
};

const MeaningBlock: React.FC<MeaningBlockProps> = ({ meaning, rootFontSize }) => {
	return (
		<div className='space-y-2 mb-1 bg-white hover:bg-main duration-200 p-3 border-single border-line rounded'>
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
					<p
						key={index}
						style={{
							fontSize: rootFontSize + 'px',
						}}
						className='ml-4 my-0'
					>
						&bull; {example}
					</p>
				))}
			</div>
		</div>
	);
};

export default App;
