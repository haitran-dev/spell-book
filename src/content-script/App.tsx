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
						height: '100%',
						color: 'var(--dark-txt)',
						position: 'absolute',
						inset: 0,
						backgroundColor: 'var(--color-main)',
						backdropFilter: 'blur(12px)',
						paddingLeft: '6px',
						paddingRight: '6px',
						paddingTop: '40px',
						paddingBottom: '6px',
						display: 'flex',
						flexDirection: 'column',
						gap: '8px',
						borderLeft: '1px solid var(--color-line)',
					}}
				>
					{!isFirstChild ? (
						<Icon
							onClick={handleCloseTab}
							style={{
								position: 'absolute',
								top: '4px',
								left: '4px',
								border: '1px solid var(--color-line)',
								borderRadius: '4px',
								backgroundColor: '#fff',
								transitionDuration: '200ms',
							}}
							svg={ArrowLeftSVG}
							title='Back'
						/>
					) : null}
					<div
						style={{
							position: 'absolute',
							top: '4px',
							right: '4px',
							display: 'flex',
							gap: '4px',
							alignItems: 'center',
						}}
					>
						<Popover>
							<Popover.Trigger>
								<Icon
									style={{
										border: '1px solid var(--color-line)',
										borderRadius: '4px',
										backgroundColor: '#fff',
										transitionDuration: '200ms',
									}}
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
							style={{
								color: 'var(--color-danger)',
								border: '1px solid var(--color-line)',
								borderRadius: '4px',
								backgroundColor: '#fff',
								transitionDuration: '200ms',
							}}
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
								<div
									style={{
										display: 'flex',
										flexDirection: 'column',
										gap: '4px',
										marginBottom: '4px',
									}}
								>
									<div
										style={{
											display: 'flex',
											gap: '4px',
											alignItems: 'center',
										}}
									>
										<p
											style={{
												fontSize: `${1.875 * +rootFontSize}px`,
												fontWeight: '600',
											}}
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
											fontWeight: '600',
											fontStyle: 'italic',
										}}
									>
										{type}
									</p>
									<div
										style={{
											display: 'flex',
											gap: '16px',
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
															display: 'flex',
															gap: '4px',
															alignItems: 'center',
														}}
													>
														<p
															style={{
																fontWeight: 600,
																textTransform: 'uppercase',
																lineHeight: 1,
															}}
														>
															{audioType}
														</p>
														<Icon
															onClick={() =>
																handlePlayAudio(audioType)
															}
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
								<div
									style={{
										display: 'flex',
										flexDirection: 'column',
										gap: '6px',
										width: '100%',
										paddingRight: '8px',
										marginRight: '-4px',
										overflow: 'auto',
									}}
								>
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
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				gap: '8px',
				marginBottom: '1px',
				backgroundColor: '#fff',
				padding: '12px',
				border: '1px solid var(--color-line)',
				borderRadius: '4px',
			}}
		>
			<p
				style={{
					fontSize: `${1.075 * rootFontSize}px`,
					fontWeight: '600',
				}}
			>
				{meaning.text}
			</p>
			<div
				style={{
					fontSize: `${0.95 * rootFontSize}px`,
					display: 'flex',
					flexDirection: 'column',
					gap: '4px',
				}}
			>
				{meaning.examples.map((example, index) => (
					<p
						key={index}
						style={{
							fontSize: rootFontSize + 'px',
							marginLeft: '16px',
							marginTop: 0,
							marginBottom: 0,
						}}
					>
						&bull; {example}
					</p>
				))}
			</div>
		</div>
	);
};

export default App;
