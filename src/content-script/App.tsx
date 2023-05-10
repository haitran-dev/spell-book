import React, { useEffect } from 'react';
import { Transition } from 'react-transition-group';
import { CAMBRIDGE_DOMAIN } from '../constant';
import ArrowLeftSVG from '../svgs/arrow-left.svg';
import CloseSVG from '../svgs/close.svg';
import LinkSVG from '../svgs/link.svg';
import VolumeSVG from '../svgs/volume.svg';
import Icon from '../ui/icon';
import { Meaning } from '../types/custom';

const duration = 300;

const defaultStyle = {
	transition: `transform ${duration}ms ease-out`,
	transform: 'translateX(101%)',
};

const transitionStyles = {
	entering: { transform: 'translateX(101%)' },
	entered: { transform: 'translateX(0)' },
};

const App = ({ data, onClose, onGoBack, isFirstChild }) => {
	const audiosRef = React.useRef(null);
	const [isOpen, setOpen] = React.useState(false);
	const { type, audios, meanings } = data;

	useEffect(() => {
		// trigger animation
		setOpen(true);
	}, []);

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
		console.log({ audioEle, play: audioEle.play, load: audioEle.load });
		audioEle.play();
	};

	return (
		<Transition in={isOpen} timeout={duration}>
			{(state) => (
				<div
					style={{
						...defaultStyle,
						...transitionStyles[state],
					}}
					className='h-full text-dark-txt absolute inset-0 bg-blur px-3 pt-10 pb-2 flex-column gap-2 border-l border-solid border-line'
				>
					{!isFirstChild ? (
						<Icon
							onClick={handleCloseTab}
							className='absolute top-1 left-1 border border-solid border-line border-opacity-30 rounded bg-white/30 hover:bg-white duration-200'
							svg={ArrowLeftSVG}
							title='Back'
						/>
					) : null}
					<Icon
						onClick={handleCloseAllTabs}
						className='absolute top-1 right-1 text-danger border border-solid border-line border-opacity-30 rounded bg-white/30 hover:bg-white duration-200'
						svg={CloseSVG}
						title='Close all tabs'
					/>
					<div className='flex gap-1 items-center'>
						<p className='text-3xl font-bold'>{data.title}</p>
						<a
							href={`${CAMBRIDGE_DOMAIN}/dictionary/english/${data.title}`}
							target='_blank'
							rel='noopener noreferrer'
						>
							<Icon svg={LinkSVG} svgW={16} title='Original source' />
						</a>
					</div>
					<p className='text-sm font-semibold italic'>{type}</p>
					<div className='flex gap-4'>
						{audios?.map((audio) => {
							const audioType = audio.type;

							if (!audioType) return null;

							return (
								<React.Fragment key={audioType}>
									<div className='flex gap-1 items-center text-[15px]'>
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
};

const MeaningBlock: React.FC<MeaningBlockProps> = ({ meaning, isFirstItem }) => (
	<div className='space-y-2 mb-2'>
		{!isFirstItem && (
			<div className='h-[1px] w-[calc(100% + 12px)] -ml-[6px] -mr-[6px] bg-line' />
		)}
		<p className='text-[18px] font-semibold'>{meaning.text}</p>
		<ul className='list-disc flex-column gap-1'>
			{meaning.examples.map((example, index) => (
				<li key={index} className='text-[15px] ml-8 my-0'>
					{example}
				</li>
			))}
		</ul>
	</div>
);

export default App;
