import React from 'react'

const Header = ({ title, description }: { title: string, description?: string }) => {
    return (
        <header className="bg-transparent">
            <div className="mx-auto max-w-screen-xl p-2">
                <div className="flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">{title}</h1>

                        <p className="mt-1.5 text-sm text-gray-500">
                            {description}
                        </p>
                    </div>


                </div>
            </div>
        </header>
    )
}

export default Header
