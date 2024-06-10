interface Streak {
    name: string;
    description: string;
    startDate: string;
    highest: number;
}

const todayShortDate = () => {
    const d = new Date();
    const year = d.getFullYear();
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const day = d.getDate().toString().padStart(2, '0');

    return `${year}-${month}-${day}`;
};

const daysSinceToday = (d: Date) => {
    const diff = new Date().getTime() - d.getTime();
    const diffDays = Math.round(diff / (1000 * 3600 * 24));

    return diffDays;
};

const main = () => {
    const modalBg = document.getElementById('modal-bg')!;
    const newStreakButton = document.getElementById('new') as HTMLButtonElement;

    // create modal
    const createModalContainer = document.getElementById('create-modal')!;
    const createModalNameInput = document.getElementById('streak-name') as HTMLInputElement;
    const createModalDescInput = document.getElementById(
        'streak-description'
    ) as HTMLTextAreaElement;
    const createModalButton = document.getElementById('create')!;

    createModalButton.onclick = () => {
        closeModal();
        createStreak({
            name: createModalNameInput.value,
            description: createModalDescInput.value,
            startDate: todayShortDate(),
            highest: 0,
        });

        createModalNameInput.value = '';
        createModalDescInput.value = '';
    };

    // reset modal

    const openModal = (modal: 'create' | 'reset') => {
        modalBg.style.display = 'block';
        if (modal === 'create') {
            createModalContainer.style.display = 'block';
        }
    };

    const closeModal = () => {
        modalBg.style.display = 'none';
        createModalContainer.style.display = 'none';
    };

    // general
    newStreakButton.onclick = () => {
        openModal('create');
    };

    loadStreaks((name) => {
        console.log(`resetting streak ${name}`);
    });
};

const createStreak = (streak: Streak) => {
    const allStreaks = localStorage.getItem('streaks');
    if (allStreaks === null) {
        localStorage.setItem('streaks', JSON.stringify({ [streak.name]: streak }));
    } else {
        const data = JSON.parse(allStreaks);
        data[streak.name] = streak;
        localStorage.setItem('streaks', JSON.stringify(data));
    }
};

const loadStreaks = (resetCallback: (streak: string) => void) => {
    console.count('loading');
    console.trace();
    const streaksContainer = document.querySelector('main')!;

    const streaksData = localStorage.getItem('streaks');
    if (streaksData === null) {
        return;
    }
    const streaks: { [key: string]: Streak } = JSON.parse(streaksData);
    const sortedStreaks = Object.entries(streaks).sort((a, b) => {
        return daysSinceToday(new Date(a[1].startDate)) - daysSinceToday(new Date(b[1].startDate));
    });

    for (const [streakName, streak] of sortedStreaks) {
        const streakContainer = document.createElement('div');
        streakContainer.classList.add('streak');

        const durationContainer = document.createElement('div');
        durationContainer.classList.add('duration');
        const streakDuration = daysSinceToday(new Date(streak.startDate));
        durationContainer.innerText = streakDuration > 1 ? `${streakDuration} days` : `0 days`;

        const nameContainer = document.createElement('div');
        nameContainer.classList.add('name');
        nameContainer.innerText = streakName;

        const highestContainer = document.createElement('div');
        highestContainer.classList.add('highest');

        const resetButton = document.createElement('button');
        resetButton.classList.add('reset');
        resetButton.innerText = 'Reset';

        resetButton.onclick = () => {
            resetCallback(streakName);
        };

        streakContainer.append(durationContainer, nameContainer, highestContainer, resetButton);
        streaksContainer.append(streakContainer);
    }
};

main();
