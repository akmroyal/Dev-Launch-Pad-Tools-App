import type React from "react"

import { useState } from "react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

export default function GameRules({ children }: { children: React.ReactNode }) {
    const [open, setOpen] = useState(false)

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-3xl bg-gray-950 border-gray-700 text-white">
                <DialogHeader>
                    <DialogTitle className="text-2xl text-yellow-300">Game Rules</DialogTitle>
                    <DialogDescription className="text-gray-200">
                        Learn how to play ShipBattle Guess and dominate the seas!
                    </DialogDescription>
                </DialogHeader>

                <div className="mt-4">
                    <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="item-1" className="border-gray-700">
                            <AccordionTrigger className="text-gray-100 hover:text-yellow-300">Game Objective</AccordionTrigger>
                            <AccordionContent className="text-gray-200">
                                <p>
                                    The objective of ShipBattle Guess is to sink all of your opponent's ships before they sink yours. Each
                                    player has a fleet of ships that they place on their grid, and players take turns guessing the
                                    coordinates of their opponent's ships.
                                </p>
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="item-2" className="border-gray-700">
                            <AccordionTrigger className="text-gray-100 hover:text-yellow-300">Ship Placement</AccordionTrigger>
                            <AccordionContent className="text-gray-200">
                                <p>
                                    At the start of the game, each player places their ships on their grid. Ships can be placed
                                    horizontally or vertically, but not diagonally. Ships cannot overlap or extend beyond the grid.
                                </p>
                                <p className="mt-2">Your fleet consists of:</p>
                                <ul className="list-disc pl-5 mt-1 space-y-1">
                                    <li>1 Carrier (5 spaces)</li>
                                    <li>1 Battleship (4 spaces)</li>
                                    <li>1 Cruiser (3 spaces)</li>
                                    <li>1 Submarine (3 spaces)</li>
                                    <li>1 Destroyer (2 spaces)</li>
                                </ul>
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="item-3" className="border-gray-700">
                            <AccordionTrigger className="text-gray-100 hover:text-yellow-300">Taking Turns</AccordionTrigger>
                            <AccordionContent className="text-gray-200">
                                <p>
                                    Players take turns guessing the coordinates of their opponent's ships. After a player makes a guess,
                                    the game will indicate whether the guess was a "hit" or a "miss".
                                </p>
                                <p className="mt-2">
                                    If a player hits an opponent's ship, they get another turn. If they miss, it becomes the opponent's
                                    turn.
                                </p>
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="item-4" className="border-gray-700">
                            <AccordionTrigger className="text-gray-100 hover:text-yellow-300">Winning the Game</AccordionTrigger>
                            <AccordionContent className="text-gray-200">
                                <p>
                                    The first player to sink all of their opponent's ships wins the game. A ship is sunk when all of its
                                    spaces have been hit.
                                </p>
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="item-5" className="border-gray-700">
                            <AccordionTrigger className="text-gray-100 hover:text-yellow-300">In-Game Chat</AccordionTrigger>
                            <AccordionContent className="text-gray-200">
                                <p>
                                    Players can communicate with each other using the in-game chat feature. This can be used for strategy,
                                    friendly banter, or to coordinate game play.
                                </p>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </div>
            </DialogContent>
        </Dialog>
    )
}
