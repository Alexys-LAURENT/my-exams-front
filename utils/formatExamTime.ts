/**
 *
 * @param seconds Number of seconds to format
 * @returns A string in the format "MM:SS"
 */
export const formatExamTime = (seconds: number | null) => {
	if (seconds === null) return '--:--';
	const mins = Math.floor(seconds / 60);
	const secs = seconds % 60;
	return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};
