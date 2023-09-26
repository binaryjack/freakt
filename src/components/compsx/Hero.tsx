/** @jsxImportSource theme-ui */
import React from 'react'
import { ThemeUIStyleObject } from 'theme-ui'

import { colorPresetProvider } from '../button/buttonGesture'
import { Typography } from '../typography'

export interface IHeroProps
    extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
    id: string
    title: string
    subTitle: string
    titleColorName?: string
    subbTitleColorName?: string
    backgroundImage?: JSX.Element
    actionChild?: React.ReactNode
    sxStyleFrame?: ThemeUIStyleObject | undefined
    sxStyleFirstPlan?: ThemeUIStyleObject | undefined
}

const Hero: React.FC<IHeroProps> = ({
    id,
    title,
    subTitle,
    titleColorName = 'text',
    subbTitleColorName = 'text',
    backgroundImage,
    actionChild,
    sxStyleFrame,
    sxStyleFirstPlan,
}): JSX.Element => {
    return (
        <div
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                width: '100%',
                minWidth: '350px',
                height: 'auto',
                overflow: 'hidden',
                position: 'relative',

                background: 'backgroundBoxBody',
                color: 'colorBoxBody',
                borderColor: 'borderBoxBody',
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover',
                padding: 0,
                margin: 0,
                top: 0,
                bottom: 0,
                left: 0,
                right: 0,
                ...sxStyleFrame,
            }}
        >
            <div
                sx={{
                    position: 'absolute',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column',

                    width: '100%',
                    height: '100%',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: 'cover',
                    zIndex: 99,
                    ...sxStyleFirstPlan,
                }}
            >
                <>
                    {title && (
                        <Typography
                            htmlTag="h1"
                            options={{ variantSize: 'XXXT' }}
                            sxStyle={{
                                color: colorPresetProvider(
                                    titleColorName,
                                    false
                                ).color,
                                padding: 0,
                                margin: 0,
                                fontSize: ['3em', '4em', '6em', '9em'],
                                transition: 'all 0.3s ease-in-out',
                            }}
                        >
                            {title}
                        </Typography>
                    )}
                    {subTitle && (
                        <Typography
                            htmlTag="h3"
                            sxStyle={{
                                color: colorPresetProvider(
                                    subbTitleColorName,
                                    false
                                ).color,
                                padding: 0,
                                margin: 0,
                                fontSize: ['1em', '2em', '3em', '4em'],
                                transition: 'all 0.3s ease-in-out',
                            }}
                        >
                            {subTitle}
                        </Typography>
                    )}
                    {actionChild && <div>{actionChild}</div>}
                </>
            </div>
            {backgroundImage && <>{backgroundImage}</>}
        </div>
    )
}
export default Hero
