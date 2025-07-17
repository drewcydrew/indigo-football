import React from "react";
import { Player } from "../../context/NamesContext";
import PlayerModal from "../shared/PlayerModal";

interface PlayerEditModalProps {
  visible: boolean;
  player: Player | null;
  onClose: () => void;
  onSave: (name: string, score: number, bio: string) => void;
  onDelete?: (player: Player) => void;
}

const PlayerEditModal: React.FC<PlayerEditModalProps> = ({
  visible,
  player,
  onClose,
  onSave,
  onDelete,
}) => {
  return (
    <PlayerModal
      visible={visible}
      player={player}
      onClose={onClose}
      onSave={onSave}
      onDelete={onDelete}
    />
  );
};

export default PlayerEditModal;
